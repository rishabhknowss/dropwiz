import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  for (const id of STORES) {
    const url = `http://localhost:3000/demo/store/${id}`;
    console.log(`Taking screenshot of store ${id}...`);

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('nav', { timeout: 5000 });

      const outputPath = join(__dirname, '..', 'public', 'stores', `store-${id}.png`);
      await page.screenshot({ path: outputPath, type: 'png' });
      console.log(`  Saved: ${outputPath}`);
    } catch (err) {
      console.error(`  Error for store ${id}:`, err.message);
    }
  }

  await browser.close();
  console.log('Done!');
}

takeScreenshots().catch(console.error);
