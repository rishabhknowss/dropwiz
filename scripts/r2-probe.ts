import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { uploadAsset, getAsset, deleteAsset, presignGetUrl, publicUrlFor } =
    await import("../src/lib/storage/r2");

  const key = "_probe/hello.txt";
  const body = `dropwiz r2 probe · ${new Date().toISOString()}`;

  const uploaded = await uploadAsset({
    key,
    body,
    contentType: "text/plain",
    cacheControl: "no-store",
  });
  console.log("✓ uploaded:", uploaded.key, `${uploaded.bytes}B`);

  const fetched = await getAsset(key);
  console.log("✓ read back:", fetched.toString("utf-8"));

  const signed = await presignGetUrl(key, 60);
  console.log("✓ presign GET URL (60s):", signed.slice(0, 80) + "...");

  const publicUrl = publicUrlFor(uploaded.key);
  if (publicUrl) console.log("✓ public URL:", publicUrl);

  await deleteAsset(key);
  console.log("✓ deleted");
}

main().catch((err) => {
  console.error("✗ r2 probe failed:", err);
  process.exit(1);
});
