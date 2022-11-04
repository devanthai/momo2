const TelegramBot = require('node-telegram-bot-api');
const token = '5696027510:AAEmTzoy531qrgUp2xBpz2iLhjYrwCV_Xdg';
const bot = new TelegramBot(token, { polling: true });
module.exports = bot