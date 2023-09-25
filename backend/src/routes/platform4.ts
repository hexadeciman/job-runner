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

    await page.waitForSelector('img');
    const rentalInfo = await page.evaluate(() => {
        function findPriceSibling(element) {
            let sibling = element.nextSibling;
            while (sibling.nextSibling) {
                sibling = sibling.nextSibling;
            }
            return sibling || null;
        }

        const row = {
            rent: "",
            address: "",
            charges: "",
            floor: "",
            numberOfRooms: "",
            area: "",
            description: "",
            imgUrls: []
        };
        
        // imgs
        const imgUrls = [];
        const elementsWithDataThumbnail = document.querySelectorAll('[data-thumbnail]');
        elementsWithDataThumbnail.forEach(element => {
            imgUrls.push(element.getAttribute('data-thumbnail'));
        });
        row.imgUrls = imgUrls;

        // rent
        const h1Elements = Array.from(document.querySelectorAll('h1'));
        const el = h1Elements
                    .filter(h1 => h1.textContent.trim().startsWith('PRIX : '))
                    .map(h1 => h1.textContent.trim());
        row.rent = el?.[0] ?? ""
        row.rent = row.rent.replace(/\s+/g, '');

        // address
        row.address = (document.querySelector(".elementor-heading-title") as HTMLElement).innerText;
        
        const sibblingMap = [
            {selector: "CHARGES MENSUELLES", key: "charges", type: "number"},
            {selector: "ETAGE", key: "floor", type: "number"},
            {selector: "NOMBRE DE PIECES", key: "numberOfRooms", type: "number"},
        ]
        const h5Elements = document.querySelectorAll('h5');
        h5Elements.forEach(h5 => {
                for(const sib of sibblingMap) {
                if (h5.textContent.trim() === sib.selector) {
                    const siblingElement = findPriceSibling(h5);
                    if (siblingElement) {
                        row[sib.key] = siblingElement.innerText;
                    }
                }
            }
        });

        return row;
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
        description: `CHF${price}.- - ${rentalInfo.address} - ${rentalInfo.area} ${rentalInfo.numberOfRooms === "" ? "" : ` - ${rentalInfo.numberOfRooms} pièces`} - ${rentalInfo.floor}`,
        contact: "NAEF +41 22 839 39 39",
        link: url
    };
}

async function getLinks(page, url) {
    await page.goto(url);
    await delay(1000);

    // Wait for the button to be available
    await page.waitForSelector('[data-cky-tag="accept-button"]');
    // Click on the button
    await page.click('[data-cky-tag="accept-button"]');
    
    await delay(1000);
    // Wait for the select element to be available
    await page.waitForSelector('#form-field-type_bien');
    await page.select('#form-field-type_bien', '1');
    await page.waitForSelector('[data-column-clickable]');

    await page.waitForSelector('#form-field-prix');
    await page.select('#form-field-prix', '0.0035;0.005');
    await page.waitForSelector('[data-column-clickable]');

    await page.waitForSelector('#form-field-pieces');
    await page.select('#form-field-pieces', '4;5');
    await page.waitForSelector('[data-column-clickable]');

    const urls = await page.evaluate(() => {
        let uniqueLinks = new Set();
        const elements = Array.from(document.querySelectorAll('[data-column-clickable]'));
        let allAnchors = elements.map(element => element.getAttribute('data-column-clickable'));
        allAnchors.forEach(el => {
            if(el.startsWith("https://www.bordier-schmidhauser.ch/detail-location/")) {
                uniqueLinks.add(el);
            }   
        });
        return Array.from(uniqueLinks);
    });
    return urls;
};

export const pingPlatform4 = async () => {
    console.log("pinging https://www.bordier-schmidhauser.ch/location/");
    const { page, browser } = await getPuppeteerPage();

    const urls = await getLinks(page, "https://www.bordier-schmidhauser.ch/location/");
    const rentalInfos = [];
    console.log(urls);
    for (const url of urls) {
        await delay(200);
        const rentalInfo = await getRentalInfo(page, url)
        rentalInfos.push(rentalInfo);
    }

    const count = await insertMatches(rentalInfos);
    await notifyLastNRows(count);
    await browser.close();
    console.log(`p4 Matches found: ${urls.length}`);
}