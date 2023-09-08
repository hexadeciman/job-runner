import puppeteer from "puppeteer";

export async function getPuppeteerPage() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    return { browser, page };
}