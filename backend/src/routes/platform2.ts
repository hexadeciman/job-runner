import { getCurrentFormattedDate } from '../helpers/getCurrentFormattedDate';
import { insertMatches } from '../utils/db';
import { notifyLastNRows } from '../utils/notify';
import { getPriceFromString } from '../helpers/getPriceFromString';
import { getPuppeteerPage } from '../utils/puppeteer';
import { hashObject } from '../helpers/hashObject';

async function getRentalInfo(url, page) {
    await page.goto(url);
    // Wait for the elements to be visible
    await page.waitForSelector('.font-semibold.text-right');
    await page.waitForSelector('img');
    // Extract rental information
    const rentalInfo = await page.evaluate(() => {
        const imgElements = document.querySelectorAll('img');
        const imgUrls = [];
        imgElements.forEach(img => {
            const src = img.getAttribute('src');
            if (src && src.startsWith('/_next/image?url=https%3A%2F%2Fedit.bory.ch%2Fapp%2Fuploads')) {
                imgUrls.push(`https://www.bory.ch${src}`);
            }
        });
        const description = (document.querySelector(".prose") as HTMLElement).innerText;
        const dtElements = document.querySelectorAll('dt');
        let data: any = {};
        const keyElements = [
            {elText: "Rent", key: "rent"},
            {elText: "Charges", key: "charges"},
            {elText: "Availability", key: "availability"},
            {elText: "Address", key: "address"},
            {elText: "Area", key: "area"},
            {elText: "Room(s)", key: "numberOfRooms"},
            {elText: "Floor", key: "floor"}
        ]
        for (const dt of dtElements) {
            for(const keyEl of keyElements){
                console.log(dt.innerText)
                if (dt.innerText.includes(keyEl.elText)) {
                    const ddElement = dt.nextElementSibling;
                    data[keyEl.key] = ddElement ? (ddElement as HTMLElement).innerText : "";
                }
            }
        }
        const {charges, rent, address, area, numberOfRooms, floor} = data;
        const results = {
            rent,
            charges,
            address,
            area,
            numberOfRooms,
            floor,
            description,
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
        description: `${price}.- CHF - ${rentalInfo.address} - ${rentalInfo.area}m2 - ${rentalInfo.numberOfRooms} pièces - ${rentalInfo.floor} - ${rentalInfo.description}`,
        contact: "Réception Bory 022 708 12 12",
        link: url
    };
}

async function getLinks(page) {
    await page.goto('https://www.bory.ch/en/rentals?types=APP&roomsMin=4&roomsMax=5&first=20&after=&last=&before=');
    const urls = await page.evaluate(() => {
        let uniqueLinks = new Set();
        let allAnchors = Array.from(document.querySelectorAll('a'));
        allAnchors.forEach(anchor => {
            if (anchor.href.startsWith('https://www.bory.ch/en/rentals/')) {
                uniqueLinks.add(anchor.href);
            }
        });
        return Array.from(uniqueLinks);
    });
    return urls;
};

export const pingPlatform2 = async () => {
    console.log("pinging https://www.bory.ch/");
    const { page, browser } = await getPuppeteerPage();
    const urls = await getLinks(page);
    const rentalInfos = [];
    for (const url of urls) {
        const rentalInfo = await getRentalInfo(url, page)
        rentalInfos.push(rentalInfo);
    }
    const count = await insertMatches(rentalInfos);
    await notifyLastNRows(count);
    await browser.close();
    console.log(`p2 Matches found: ${count}`);
}