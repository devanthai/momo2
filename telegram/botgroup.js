const TelegramBot = require('node-telegram-bot-api');
const token = '5552183564:AAEW-TdiV8L3f0Cfh-pzJZdlDJh61LngNaQ';
const bot = new TelegramBot(token, { polling: true });
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     if (chatId < 0 && msg.new_chat_member) {
//         const username = msg.new_chat_member.username
//         const first_name = msg.new_chat_member.first_name
//         const fromid = msg.new_chat_member.id;
//         const qc = `Azmomo.vip Chẵn Lẻ Tài xỉu ví momo tự động 24/7 thanh toán sau 3 giây đua top tuần nhận thưởng lên tới 10 Triệu VNĐ - sử dụng số cuối mã giao dịch khi chuyển tiền làm kết quả công khai minh bạch`
//         const mention = "[" + first_name + "](tg://user?id=" + fromid + ")"
//         const mess = "Chào " + mention + " \n" + qc
//         bot.sendPhoto(chatId, "https://img.upanh.tv/2022/05/28/Capturee15e2f3ceeec7926.png", { caption: mess, parse_mode: "Markdown" });
//     }
// });


setInterval(()=>{
        const qc = `Azmomo.vip Chẵn Lẻ Tài xỉu ví momo tự động 24/7 thanh toán sau 3 giây đua top tuần nhận thưởng lên tới 10 Triệu VNĐ - sử dụng số cuối mã giao dịch khi chuyển tiền làm kết quả công khai minh bạch`
        const mess =  qc
        bot.sendPhoto(-1001630788325, "https://img.upanh.tv/2022/05/28/Capturee15e2f3ceeec7926.png", { caption: mess, parse_mode: "Markdown" });
},3600000)

module.exports = bot