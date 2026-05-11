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
      "Professional headshot portrait of a confident Asian woman in her early 30s, warm smile, wearing a casual business blazer, soft natural lighting, blurred modern home office background, high quality, photorealistic, looking directly at camera, approachable expression",
  },
  {
    filename: "marcus.jpg",
    prompt:
      "Professional headshot portrait of a successful Black man in his mid 30s, confident smile, well-groomed short beard, wearing a dark polo shirt, natural window lighting, blurred minimalist living room background, high quality, photorealistic, looking directly at camera, warm friendly expression",
  },
  {
    filename: "jessica.jpg",
    prompt:
      "Professional headshot portrait of a polished Korean-American woman in her late 20s, bright genuine smile, wearing a cream colored sweater, soft studio lighting, clean white background with subtle gradient, high quality, photorealistic, looking directly at camera, professional yet approachable",
  },
  {
    filename: "david.jpg",
    prompt:
      "Professional headshot portrait of a friendly Caucasian man in his early 40s, natural smile, short brown hair, wearing a navy blue button-down shirt, warm natural lighting, blurred coffee shop background, high quality, photorealistic, looking directly at camera, trustworthy expression",
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
