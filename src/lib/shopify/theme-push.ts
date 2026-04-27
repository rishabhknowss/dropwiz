import axios, { AxiosError } from "axios";
import type { ThemeFile } from "./theme-export";

const API_VERSION = "2024-10";

const SKELETON_THEME_ZIP =
  "https://github.com/Shopify/skeleton-theme/archive/refs/heads/main.zip";

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
    timeout: 30_000,
  });
}

async function listThemes(shop: string, accessToken: string): Promise<Theme[]> {
  try {
    const res = await adminApi(shop, accessToken).get<ThemesResponse>(
      "/themes.json",
    );
    return res.data.themes;
  } catch (err) {
    throw shopifyError(err, "list themes");
  }
}

async function findDropwizTheme(
  shop: string,
  accessToken: string,
  storeId: string,
): Promise<Theme | null> {
  const themes = await listThemes(shop, accessToken);
  const tag = themeTagFor(storeId);
  return (
    themes.find(
      (t) => t.role === "unpublished" && t.name.includes(tag),
    ) ?? null
  );
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
          src: SKELETON_THEME_ZIP,
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
  maxMs = 30_000,
): Promise<void> {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    try {
      const res = await adminApi(shop, accessToken).get<{
        theme: Theme & { processing?: boolean };
      }>(`/themes/${themeId}.json`);
      if (!res.data.theme.processing) return;
    } catch {
      // ignore transient
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
}

async function uploadAsset(
  shop: string,
  accessToken: string,
  themeId: number,
  file: ThemeFile,
): Promise<void> {
  try {
    await adminApi(shop, accessToken).put(`/themes/${themeId}/assets.json`, {
      asset: { key: file.key, value: file.value },
    });
  } catch (err) {
    throw shopifyError(err, `upload ${file.key}`);
  }
}

export async function pushDropwizTheme(input: {
  shop: string;
  accessToken: string;
  storeId: string;
  storeName: string;
  files: ThemeFile[];
}): Promise<{ themeId: number; created: boolean }> {
  const { shop, accessToken, storeId, storeName, files } = input;

  let theme = await findDropwizTheme(shop, accessToken, storeId);
  let created = false;
  if (!theme) {
    theme = await createUnpublishedTheme(shop, accessToken, storeId, storeName);
    created = true;
    await waitForThemeReady(shop, accessToken, theme.id);
  }

  for (const file of files) {
    await uploadAsset(shop, accessToken, theme.id, file);
  }

  return { themeId: theme.id, created };
}
