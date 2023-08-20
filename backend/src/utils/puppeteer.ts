import puppeteer from "puppeteer";

export async function getPuppeteerPage() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    const page = await browser.newPage();
    return { browser, page };
}