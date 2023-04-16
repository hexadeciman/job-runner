import { telegramConfig } from "../config/telegram";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(telegramConfig.token);
const { DateTime } = require("luxon");


const getTelegramMessage = (message = "Test message") => {
  return `
    <code>
        ${message}
        📅 ${DateTime.now().toFormat("yyyy LLL dd h:MM:ss")}
        🤖 Home Finder
    </code>
  `;
};

export const notifyServices = (matches) => {
  // Telegram
  matches.forEach((match) => {
    const message = getTelegramMessage();
    bot.sendMessage(telegramConfig.chatId, message, {
      parse_mode: "HTML",
    });
  });
};

export const sendMessage = async () => {
  await bot.sendMessage(telegramConfig.chatId, getTelegramMessage(), {
        parse_mode: "HTML",
  });

  return true;
};

export const sendPhotos = async (urls: string[]) => {
  if(!urls || urls.length === 0) {
    return false;
  }
  if(urls.length === 1) {
    await bot.sendPhoto(telegramConfig.chatId, urls[0]);
  } else if(urls.length > 1) {
    const photos = urls.reduce((acc, url) => [...acc, {
      type: "photo", media: url
    }],[])
    await bot.sendMediaGroup(telegramConfig.chatId, photos)
  }
  return true;  
};
