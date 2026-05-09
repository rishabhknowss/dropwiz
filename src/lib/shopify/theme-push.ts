import axios, { AxiosError } from "axios";
import type { ThemeFile } from "./theme-export";
import { shopifyGraphql } from "./client";

const API_VERSION = "2026-01";

const log = (event: string, data: Record<string, unknown> = {}) => {
  const ts = new Date().toISOString();
  console.log(`[theme-push ${ts}] ${event}`, JSON.stringify(data, null, 2));
};

const since = (start: number) => `${Date.now() - start}ms`;

function shopifyError(err: unknown, context: string): Error {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    const data = err.response?.data;
    const detail =
      typeof data === "string"
        ? data
        : data?.errors
          ? typeof data.errors === "string"
            ? data.errors
            : JSON.stringify(data.errors)
          : data?.error
            ? data.error
            : err.message;
    return new Error(`Shopify ${context} failed (${status}): ${detail}`);
  }
  return err instanceof Error ? err : new Error(String(err));
}

type Theme = {
  id: number;
  name: string;
  role: "main" | "unpublished" | "demo" | "development";
};

type ThemesResponse = { themes: Theme[] };
type ThemeResponse = { theme: Theme };

function adminApi(shop: string, accessToken: string) {
  return axios.create({
    baseURL: `https://${shop}/admin/api/${API_VERSION}`,
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    timeout: 60_000,
  });
}

async function listThemes(shop: string, accessToken: string): Promise<Theme[]> {
  log("listThemes.start", { shop });
  const t0 = Date.now();
  try {
    const res = await adminApi(shop, accessToken).get<ThemesResponse>(
      "/themes.json",
    );
    log("listThemes.success", {
      shop,
      count: res.data.themes.length,
      themes: res.data.themes.map((t) => ({ id: t.id, name: t.name, role: t.role })),
      took: since(t0),
    });
    return res.data.themes;
  } catch (err) {
    log("listThemes.error", {
      shop,
      error: err instanceof Error ? err.message : String(err),
      took: since(t0),
    });
    throw shopifyError(err, "list themes");
  }
}

async function findMainTheme(
  shop: string,
  accessToken: string,
): Promise<Theme | null> {
  const themes = await listThemes(shop, accessToken);
  return themes.find((t) => t.role === "main") ?? null;
}

function themeTagFor(storeId: string): string {
  return `[dropwiz:${storeId.slice(0, 8)}]`;
}

async function createUnpublishedTheme(
  shop: string,
  accessToken: string,
  storeId: string,
  storeName: string,
): Promise<Theme> {
  const name = `Dropwiz — ${storeName} ${themeTagFor(storeId)}`.slice(0, 50);
  try {
    const res = await adminApi(shop, accessToken).post<ThemeResponse>(
      "/themes.json",
      {
        theme: {
          name,
          role: "unpublished",
        },
      },
    );
    return res.data.theme;
  } catch (err) {
    throw shopifyError(err, "create theme");
  }
}

async function waitForThemeReady(
  shop: string,
  accessToken: string,
  themeId: number,
  maxMs = 60_000,
): Promise<boolean> {
  const deadline = Date.now() + maxMs;
  let delay = 1000;
  while (Date.now() < deadline) {
    try {
      const res = await adminApi(shop, accessToken).get<{
        theme: Theme & { processing?: boolean };
      }>(`/themes/${themeId}.json`);
      if (!res.data.theme.processing) return true;
    } catch {
      // ignore transient
    }
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.5, 5000);
  }
  console.warn(`[theme-push] Theme ${themeId} still processing after ${maxMs}ms, continuing anyway`);
  return false;
}

async function uploadAsset(
  shop: string,
  accessToken: string,
  themeId: number,
  file: ThemeFile,
  maxRetries = 3,
): Promise<void> {
  const url = `https://${shop}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`;
  console.log(`[theme-push] PUT ${url}`);

  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await axios.put(
        url,
        { asset: { key: file.key, value: file.value } },
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
          timeout: 60_000,
        },
      );
      console.log(`[theme-push] PUT ${file.key} -> ${res.status}`);
      return;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(`[theme-push] PUT failed:`, {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url,
        });
      }
      lastErr = shopifyError(err, `upload ${file.key}`);
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastErr ?? new Error(`Failed to upload ${file.key}`);
}

const UPLOAD_CONCURRENCY = 5;

async function uploadWithConcurrency<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  concurrency: number,
): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item) await fn(item);
    }
  });
  await Promise.all(workers);
}

async function publishTheme(
  shop: string,
  accessToken: string,
  themeId: number,
): Promise<void> {
  try {
    await adminApi(shop, accessToken).put(`/themes/${themeId}.json`, {
      theme: { id: themeId, role: "main" },
    });
  } catch (err) {
    throw shopifyError(err, "publish theme");
  }
}

const THEME_FILES_UPSERT_MUTATION = `
  mutation themeFilesUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
    themeFilesUpsert(themeId: $themeId, files: $files) {
      upsertedThemeFiles {
        filename
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

type ThemeFilesUpsertResponse = {
  themeFilesUpsert: {
    upsertedThemeFiles: Array<{ filename: string }> | null;
    userErrors: Array<{ field: string[]; message: string; code: string }>;
  };
};

export async function pushDropwizTheme(input: {
  shop: string;
  accessToken: string;
  storeId: string;
  storeName: string;
  files: ThemeFile[];
  publish?: boolean;
}): Promise<{ themeId: number; created: boolean }> {
  const { shop, accessToken, files } = input;
  const t0 = Date.now();

  log("pushDropwizTheme.start", {
    shop,
    storeId: input.storeId,
    storeName: input.storeName,
    fileCount: files.length,
    fileKeys: files.map((f) => f.key),
    fileSizes: files.map((f) => ({ key: f.key, bytes: f.value.length })),
    totalBytes: files.reduce((sum, f) => sum + f.value.length, 0),
  });

  log("pushDropwizTheme.listingThemes", { shop });
  const themes = await listThemes(shop, accessToken);

  const mainTheme = themes.find((t) => t.role === "main");
  if (!mainTheme) {
    log("pushDropwizTheme.noMainTheme", {
      shop,
      availableThemes: themes.map((t) => ({ id: t.id, name: t.name, role: t.role })),
    });
    throw new Error("No main theme found on the shop");
  }

  log("pushDropwizTheme.mainThemeFound", {
    themeId: mainTheme.id,
    themeName: mainTheme.name,
    themeRole: mainTheme.role,
  });

  const themeGid = `gid://shopify/OnlineStoreTheme/${mainTheme.id}`;
  const graphqlFiles = files.map((f) => ({
    filename: f.key,
    body: {
      type: "TEXT",
      value: f.value,
    },
  }));

  log("pushDropwizTheme.uploadingViaGraphQL", {
    themeGid,
    fileCount: graphqlFiles.length,
    filenames: graphqlFiles.map((f) => f.filename),
  });

  const tUpload = Date.now();
  const result = await shopifyGraphql<ThemeFilesUpsertResponse>(
    shop,
    accessToken,
    THEME_FILES_UPSERT_MUTATION,
    { themeId: themeGid, files: graphqlFiles },
  );

  log("pushDropwizTheme.graphqlResponse", {
    uploadTook: since(tUpload),
    upsertedFiles: result.themeFilesUpsert.upsertedThemeFiles?.map((f) => f.filename) ?? [],
    upsertedCount: result.themeFilesUpsert.upsertedThemeFiles?.length ?? 0,
    userErrorsCount: result.themeFilesUpsert.userErrors.length,
    userErrors: result.themeFilesUpsert.userErrors,
  });

  if (result.themeFilesUpsert.userErrors.length > 0) {
    const errors = result.themeFilesUpsert.userErrors;
    const errorMessages = errors.map((e) => `${e.code}: ${e.message}`).join("; ");
    log("pushDropwizTheme.failed", {
      errors,
      errorMessages,
      totalTook: since(t0),
    });
    throw new Error(`Shopify theme upload failed: ${errorMessages}`);
  }

  log("pushDropwizTheme.success", {
    themeId: mainTheme.id,
    themeName: mainTheme.name,
    filesUploaded: files.length,
    totalTook: since(t0),
  });

  return { themeId: mainTheme.id, created: false };
}
