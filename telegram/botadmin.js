const TelegramBot = require('node-telegram-bot-api');
const token = '5361145438:AAHaTHjBPe48Ey_LZ7JQ9EOI41Dq62MlK1I';
const bot = new TelegramBot(token, { polling: true });
module.exports = bot