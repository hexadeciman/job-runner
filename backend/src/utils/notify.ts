import { telegramConfig } from "../config/telegram";
import { queryDB } from "./db";
import { lastNRowsQuery } from "../queries/lastNRows";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(telegramConfig.token);
const { DateTime } = require("luxon");
import { setTimeout } from "timers/promises";

const getHomeMessage = (address, price, description, link, fk_search) => `
${fk_search === 0 ? address.replaceAll("'", "") : description}
👉🏽 ${link}
<code>
  📅 ${DateTime.now().toFormat("yyyy LLL dd h:MM:ss")}
  🤖 Home Finder
</code>`;
const getTelegramMessage = (message = "Test message") => {
  return `
    <code>
        ${message}
        📅 ${DateTime.now().toFormat("yyyy LLL dd h:MM:ss")}
        🤖 Home Finder
    </code>
  `;
};


export const sendPhotos = async (urls: string[]) => {
  if(!urls || urls.length === 0) {
    return false;
  }
  if(urls.length === 1) {
    await bot.sendPhoto(telegramConfig.chatId, urls[0]);
  } else if(urls.length > 1) {
    const photos = urls.slice(0, 4).reduce((acc, url) => [...acc, {
      type: "photo", media: url
    }],[])
    await bot.sendMediaGroup(telegramConfig.chatId, photos)
  }
  return true;  
};

export const sendMessages = async (match) => {
  try{
    await bot.sendMessage(telegramConfig.chatId, getHomeMessage(match.address, match.price, match.description, match.link, match.fk_search), {
      parse_mode: "HTML",
    });
    if(match.photos) {
      const urls = match.photos.split("~");
      await setTimeout(3000);
      await sendPhotos(urls);
    }
  } catch {
    e => {
      console.log("err", e);
      return false;
    }
  }
  
}
export const notifyServices = async (matches) => {
  if(!matches.length) {
    return;
  }
  // Telegram
  const subMatches = matches.slice(0, 10);
    for (const match of subMatches) {
      try {
        await setTimeout(3000);
        await sendMessages(match);
      } catch {
        e => {
          console.log("err", e)
          return false;
        }
      }
  
    }  
};

export const sendMessage = async () => {
  await bot.sendMessage(telegramConfig.chatId, getTelegramMessage(), {
        parse_mode: "HTML",
  });

  return true;
};

export const notifyLastNRows = async (count) => {
  // find new matches and send notifications
  const { data: newMatches }: any = await queryDB(lastNRowsQuery, [`${count}`]);
  await notifyServices(newMatches);
}
  