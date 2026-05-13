import axios from "axios";
import * as fs from "fs";
import * as path from "path";

const BASE = "https://api.wavespeed.ai/api/v3";
const API_KEY = process.env.WAVESPEED_API_KEY;

if (!API_KEY) {
  console.error("WAVESPEED_API_KEY not set");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

type StatusResponse = {
  data: {
    id: string;
    status: "created" | "processing" | "completed" | "failed";
    outputs: string[];
    error: string | null;
  };
};

const TESTIMONIALS = [
  {
    filename: "sarah.jpg",
    prompt:
      "candid photo of a real chinese woman early 30s taking a selfie at a rooftop bar at sunset, golden hour lighting, slight smile, messy hair from wind, wearing simple white tee, iphone camera quality, natural skin texture, no makeup look, slightly grainy, instagram story vibe, casual authentic moment",
  },
  {
    filename: "marcus.jpg",
    prompt:
      "real photo of african american guy late 20s at a basketball court, post-workout selfie, slight sweat on forehead, genuine laugh showing teeth, wearing grey hoodie, outdoor harsh daylight, phone camera quality, candid unposed moment, beard stubble, real person not model",
  },
  {
    filename: "jessica.jpg",
    prompt:
      "authentic selfie of korean girl mid 20s at coffee shop, natural daylight from window, holding iced latte, subtle smile, wearing oversized sweater, messy bun hairstyle, no heavy makeup just lip gloss, grainy phone camera, cozy cafe vibes, looking slightly off camera, real instagram aesthetic",
  },
  {
    filename: "david.jpg",
    prompt:
      "candid photo of white guy early 30s at hiking trail, outdoor adventure selfie, squinting slightly from sun, 5 oclock shadow beard, wearing baseball cap backwards and flannel shirt, sweaty and windswept hair, mountains blurred in background, gopro wide angle look, authentic rugged outdoor vibes",
  },
];

async function pollJob(taskId: string, maxMs = 120_000, intervalMs = 2000): Promise<string[]> {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    const res = await axios.get<StatusResponse>(`${BASE}/predictions/${taskId}/result`, {
      headers,
      timeout: 15_000,
    });
    const data = res.data.data;
    console.log(`  Status: ${data.status}`);
    if (data.status === "completed") return data.outputs;
    if (data.status === "failed") {
      throw new Error(data.error || "Generation failed");
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Timeout waiting for image");
}

async function generateImage(prompt: string): Promise<string> {
  console.log(`Submitting job...`);

  const res = await axios.post(
    `${BASE}/wavespeed-ai/flux-dev`,
    {
      prompt,
      size: "1024*1024",
      num_images: 1,
      seed: -1,
      enable_base64_output: false,
      enable_sync_mode: false,
    },
    { headers, timeout: 30_000 }
  );

  const taskId = res.data.data.id;
  console.log(`  Task ID: ${taskId}`);

  const outputs = await pollJob(taskId);
  if (!outputs[0]) throw new Error("No output returned");

  return outputs[0];
}

async function downloadImage(url: string, destPath: string): Promise<void> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(destPath, response.data);
}

async function main() {
  const outputDir = path.join(process.cwd(), "public", "testimonials");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("\n=== Generating Testimonial Avatars ===\n");

  for (const testimonial of TESTIMONIALS) {
    console.log(`\nGenerating: ${testimonial.filename}`);
    console.log(`Prompt: ${testimonial.prompt.slice(0, 80)}...`);

    try {
      const imageUrl = await generateImage(testimonial.prompt);
      console.log(`  Image URL: ${imageUrl}`);

      const destPath = path.join(outputDir, testimonial.filename);
      await downloadImage(imageUrl, destPath);
      console.log(`  Saved to: ${destPath}`);
    } catch (err) {
      console.error(`  ERROR: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log("\n=== Done! ===\n");
}

main().catch(console.error);
