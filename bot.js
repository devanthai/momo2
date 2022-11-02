const TelegramBot = require('node-telegram-bot-api');
const token = '5641411609:AAHu3SDRexgTNmMoOvQJJDChUDszb-nz64A';
const bot = new TelegramBot(token, { polling: true });




bot.on('polling_error', (msg) => {

});
module.exports = bot