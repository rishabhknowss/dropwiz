import type { NewProduct } from "@/db/schema";
import { scrapeWithFirecrawl } from "./firecrawl";
import { analyzeProduct, type ProductAnalysis } from "./analyze";

export type ScrapedProduct = Omit<NewProduct, "id" | "createdAt" | "updatedAt"> & {
  sourceUrl: string;
  sourceUrlHash: string;
};

export async function scrapeProduct(sourceUrl: string): Promise<ScrapedProduct> {
  return scrapeWithFirecrawl(sourceUrl);
}

export { analyzeProduct };
export type { ProductAnalysis };
