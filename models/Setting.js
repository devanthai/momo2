const mongoose = require('mongoose');

const setting = new mongoose.Schema({
    setting: {
        type: String,
        default: "Setting"
    },
    thongbao: {
        type: String,
        default: "thongbao"
    },
    tieude: {
        type: String,
        default: "Trang chủ"
    },
    huongdan: {
        type: String,
        default: "huongdan"
    },
    toptuan1: { type: Number, default: 1000000 },
    toptuan2: { type: Number, default: 700000 },
    toptuan3: { type: Number, default: 500000 },
    toptuan4: { type: Number, default: 200000 },
    toptuan5: { type: Number, default: 100000 },

    linkzalo: { type: String, default: "https://zalo.me/g/xjvzfy236" },
    linklogo: { type: String, default: "https://kiemmomo.com/assets/ai7bojX.png" },
    linkTele: { type: String, default: "https://t.me/+wIgqgNGgIfliZDA1" },
    tile: {
        min: { type: Number, default: 10000 },
        max: { type: Number, default: 1000000 },
        chanle: { type: Number, default: 2.3 },
        taixiu: { type: Number, default: 2.3 },
        chanle2: { type: Number, default: 1.95 },

        gap3type1: { type: Number, default: 3 },
        gap3type2: { type: Number, default: 4 },
        gap3type3: { type: Number, default: 5 },

        tong3sotype1: { type: Number, default: 2 },
        tong3sotype2: { type: Number, default: 3 },
        tong3sotype3: { type: Number, default: 3.5 },

        phan3: { type: Number, default: 3 },

        xien: { type: Number, default: 3.3 },

        doanso: { type: Number, default: 6.6 },
    },
    sdtdaytask: { type: String, default: "0123456789" },
    sdtGioithieu: { type: String, default: "0123456789" },
    sdtGiftcode: { type: String, default: "0123456789" },
    sdtCheckKyc: { type: String, default: "0123456789" },
    SendMoneyMy: { Phone: { type: String, default: "0123456789" }, MaxMoney: { type: Number, default: 100000 } },
    ToMuchMoney: { Phone: { type: String, default: "0123456789" }, MaxMoney: { type: Number, default: 100000 } },

})
module.exports = mongoose.model('Setting', setting)