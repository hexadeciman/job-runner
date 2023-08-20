import { getCurrentFormattedDate } from '../helpers/getCurrentFormattedDate';
import { insertMatches } from '../utils/db';
import { notifyLastNRows } from '../utils/notify';
import { getPriceFromString } from '../helpers/getPriceFromString';
import { getPuppeteerPage } from '../utils/puppeteer';
import { hashObject } from '../helpers/hashObject';
import { delay } from '../helpers/delay';

async function getRentalInfo(page, url) {
    await page.goto(url);

    // Wait for the elements to be visible
    await page.waitForSelector('.property-rate-list__item');
    await page.waitForSelector('img');
    // Extract rental information

    // await page.exposeFunction("getPriceFromString", getPriceFromString);
    const rentalInfo = await page.evaluate(() => {
        const sibblingMap = [
            {selector: ".icon-area", key: "area", type: "number"},
            {selector: ".icon-eme", key: "floor", type: "number"},
            {selector: ".icon-room", key: "numberOfRooms", type: "number"},
        ]
        const startsWithMap = [
            {selector: "Loyer", key: "rent", type: "number"},
            {selector: "Charges", key: "charges", type: "number"},
            {selector: "Adresse", key: "address", type: "string"},
        ]

        let data: any = {};

        const imgElements = document.querySelectorAll(".property-media-card-img")
        const imgUrls = [];
        imgElements.forEach(img => {
                imgUrls.push((img as HTMLImageElement).src);
        });

        const startsWithElements = document.querySelectorAll(".property-rate-text")
        startsWithElements.forEach((el) => {
            for(const keyEl of startsWithMap) {
                const elStr: string = (el as any).innerText;
                if (elStr.startsWith(keyEl.selector)) {
                    const value = elStr.split(":")[1];
                    if(typeof value === 'string') {
                        data[keyEl.key] = value;
                    }
                    
                }
            }
        });
        for(const siblingEl of sibblingMap) {
            const el = document.querySelector(siblingEl.selector);
            const sibling = el.nextElementSibling;
            data[siblingEl.key] = (sibling as HTMLElement).innerText ?? "";
        }
        const {charges, rent, address, area, numberOfRooms, floor} = data;
        const results = {
            rent,
            charges,
            address,
            area,
            numberOfRooms,
            floor,
            description: "",
            imgUrls
        };
        return results;
    });

    const {imgUrls, ...dataToBeHashed} = rentalInfo;
    const price = getPriceFromString(rentalInfo?.rent ?? "0") + getPriceFromString(rentalInfo?.charges ?? "0");
    return {
        add_id: hashObject(dataToBeHashed),
        date_created: getCurrentFormattedDate(),
        address: rentalInfo.address,
        coordinates: "0,0",
        price,
        photos: imgUrls.join("~"),
        description: `${price}.- CHF - ${rentalInfo.address} - ${rentalInfo.area} - ${rentalInfo.numberOfRooms} pièces - ${rentalInfo.floor} - ${rentalInfo.description}`,
        contact: "NAEF +41 22 839 39 39",
        link: url
    };
}

async function getLinks(page, url) {
    await page.goto(url);
    await delay(1000);
    const urls = await page.evaluate(() => {
        let uniqueLinks = new Set();
        let allAnchors = Array.from(document.querySelectorAll(".property_item"));
        allAnchors.forEach(el => {
                const anchor = el.querySelector("a");
                uniqueLinks.add(anchor.href);
        });
        return Array.from(uniqueLinks);
    });
    return urls;
};

export const pingPlatform3 = async () => {
    console.log("pinging https://www.naef.ch/");
    const { page, browser } = await getPuppeteerPage();

    const urls = await getLinks(page, "https://www.naef.ch/louer/appartements/geneve/geneve-ville/?nbPieces=4&budgetMax=3100&sortingField=recent&zoom=14");
    const rentalInfos = [];
    for (const url of urls) {
        await delay(200);
        const rentalInfo = await getRentalInfo(page, url)
        rentalInfos.push(rentalInfo);
    }

    const count = await insertMatches(rentalInfos);
    await notifyLastNRows(count);
    await browser.close();
    console.log(`p3 Matches found: ${count}`);
}