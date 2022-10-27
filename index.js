const express = require('express');
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const SendTaskDay = require('./models/SendTaskDay');
const Cuocs = require('./models/Cuoc');
const TopTuan = require('./models/TopTuan');
const DayTask = require('./models/DayTask');
const Momos = require('./models/momo.model');
const Setting = require('./models/Setting');
const GioiThieu = require('./models/CodeGioiThieu');
const Giftcode = require('./models/Giftcode');
const SendGioiThieu = require('./models/SendGioiThieu');
const MomoService = require('./controllers/momo.service');



// const AutoMomo = require('./controllers/autoMomo');

app.set('trust proxy', 1)

dotenv.config()
mongoose.connect(process.env.DB_CONNECT, {}, () => console.log('Connected to db'));
app.use(express.static('public'))
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', async (req, res) => {
    const setting = await Setting.findOne({})
    res.render("web/index", { setting: setting, gioithieu: false })
})

app.post('/getLink', async (req, res) => {
    const momosOnline = await Momos.find({ status: 1, agentId: { $ne: "" } })
    if (momosOnline.length > 0) {
        const randomMomo = momosOnline[Math.floor(Math.random() * momosOnline.length)];
        const link = await getLink(req.body.sotien, req.body.game, randomMomo.agentId)
        res.send({ error: false, message: "ok", data: link })
    }
    else {
        res.send({ error: true, message: "Không tìm thấy số để chơi vui lòng thử lại sau", data: null })
    }
})

getLink = async (sotien, game, agentId) => {
    let data = `{"userId":"MiniGame đẳng cấp - uy tín","name":"😍AZMOMO.VIP😍","amount":${sotien},"transferSource":"p2p","agentId":${agentId},"receiverType":"14","message":"${game}","enableEditAmount":true,"avatarUrl":"https://img.mservice.com.vn/avatars/avatar/ec35/01c7c0ddfcbbbfec1f005654ea921f1714e928e72eaef0d23e0122bc172d.png" }`
    let buff = Buffer.from(data);
    let rs = `momo://?action=p2p&extra="{\\"dataExtract\\":\\"${buff.toString('base64')}\\"}"&url=https://momo.vn/download&serviceCode=transfer_p2p&refId=TransferInputMoney`
    return rs
}

function getCodeRan() {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return "AzmomoVip." + result;
}

app.get('/gt/:code', async (req, res) => {
    const code = req.params.code || null
    const setting = await Setting.findOne({})
    res.render("web/index", { setting: setting, gioithieu: true, code })
})


app.post('/giftcode', async (req, res) => {
    const { phone, text } = req.body
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cuoc = await Cuocs.findOne({ time: { $gte: startOfToday }, sdtchuyen: phone, tiencuoc: { $gte: 6000 } })
    if (cuoc) {
        let giftcode = await Giftcode.findOne({ code: text })
        if (!giftcode) {
            res.send("Mã này không tồn tại")
        }
        else {
            if (giftcode.status != -1) {
                res.send("Mã này đã được sử dụng")
            }
            else {
                giftcode.status = 3
                giftcode.phone = phone
                giftcode.save()
                res.send("Phần thưởng sẽ chuyển cho bạn sau vài giây")
            }
        }
    }
    else {
        res.send("Ngày hôm nay bạn phải chơi ít nhất 1 game mới có thể dùng tính năng này")
    }
})

function ChangeNumber11(phone) {
    var numbers = {
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

async function checkKYC(sdt) {
    try {
        const setting = await Setting.findOne({})
        const momos = await Momos.find({})

        const momo = momos[Math.floor(Math.random() * momos.length)];


        await MomoService.GENERATE_TOKEN(momo, momo.phone)
        const data = await MomoService.createRoom(setting.sdtGioithieu, sdt);
        if (!data.error) {
            const getroom = await MomoService.getRoom(setting.sdtGioithieu, sdt);
            if (!getroom.error) {
                if (getroom.data.json.room.warningType == "NO_KYC") {
                    return { error: false, kyc: false, data: getroom.data }
                }
                else {
                    return { error: false, kyc: true, data: getroom.data }
                }
            }
            else {
                return { error: true, data: getroom }
            }
        }
        else {
            return { error: true, data: data }
        }
    }
    catch (ex) {
        console.log(ex)
        return { error: true, data: null }
    }
}


getCuocsMoney = async (sdt) => {
    const sum = await Cuocs.aggregate([{
        $match: { sdtchuyen: sdt },
    }, {
        $group: {
            _id: null,
            tiencuoc: {
                $sum: "$tiencuoc"
            },
        }
    }])
    return sum
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
async function sumWinmmUID(sdt) {

    const sum = await Cuocs.aggregate([{
        $match: {
            sdtchuyen: sdt, status: 1, $or: noidungs
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
async function sumDemmUID(sdt) {

    const sum = await Cuocs.aggregate([{
        $match: {
            sdtchuyen: sdt, status: 2, tiencuoc: { $gte: 0 }, $or: noidungs
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

async function checkDoanhThu(sdt) {
    let tienthangtsr = await sumWinmmUID(sdt);
    let thangtsr = 0;
    let cuoctsrrr = 0;
    if (tienthangtsr) {
        thangtsr = Math.round(tienthangtsr.tienthang)
        cuoctsrrr = Math.round(tienthangtsr.tiencuoc)
    }
    let tienthuatsr = await sumDemmUID(sdt);
    let thuatsr = 0;
    if (tienthuatsr) {
        thuatsr = Math.round(tienthuatsr.tiencuoc)
    }
    console.log(thuatsr - (thangtsr - cuoctsrrr))
    return thuatsr - (thangtsr - cuoctsrrr)
}
app.post("/nhapCodeGioiThieu", async (req, res) => {
    let { code, sdt } = req.body
    if (checkPhoneValid(sdt)) {
        sdt = ChangeNumber11(sdt)
    }
    else {
        return res.send({ error: true, message: "SDT không hợp lệ" })
    }

    const checkyc = await checkKYC(sdt)

    if (checkyc.error) {
        return res.send({ error: true, message: "Đã có lỗi xảy ra vui lòng thử lại" })
    }
    else if (!checkyc.kyc) {
        return res.send({ error: true, message: "Momo của bạn chưa xác thực CMND" })
    }
    // let sdt05 = sdt.toString().substring(0, 2);
    // if (sdt05 == "05") {
    //     return res.send({ error: true, message: "Không hỗ trợ mạng VietNamMobie" })
    // }
    console.log(sdt)

    let checkgt = await GioiThieu.findOne({ code: code })
    if (checkgt) {
        if (checkgt.sdt == sdt) {
            return res.send({ error: true, message: "Trùng số của bạn rồi" })
        }
        let checkgtz = await GioiThieu.findOne({ sdt: sdt })

        if (checkgtz && checkgtz.totalGift > 0) {
            return res.send({ error: true, message: "Bạn đã nhận quà rồi mà?" })
        }
        else {
            let now = new Date();
            let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);

            const checkzz = await getCuocsMoney(sdt)
            if (checkzz.length <= 0 || (checkzz.length > 0 && checkzz[0].tiencuoc < 100000)) {
                return res.send({ error: true, message: "Vui lòng chơi trên 100.000 vnđ để nhận thưởng nhé." })
            }
            let doanhthuZ = await checkDoanhThu(sdt)
            console.log(sdt, doanhthuZ)
            if (doanhthuZ > -90000) {
                return res.send({ error: true, message: "Bạn chưa đủ điều kiện để nhận thưởng vui lòng tiếp tục chơi để nhận thưởng." })
            }


            checkgt.totalGift += 70000
            await checkgt.save()

            if (!checkgtz) {
                const codeRan = getCodeRan()
                await new GioiThieu({ code: codeRan, sdt: sdt, totalGift: 30000 }).save()
            }
            else {
                checkgtz.totalGift += 30000
                checkgtz.save()
            }

            const zz1 = await new SendGioiThieu({ phone: sdt, money: 30000 }).save()
            const zz2 = await new SendGioiThieu({ phone: checkgt.sdt, money: 70000 }).save()
            res.send({ error: false, message: "Bạn nhận được +30000 còn người giới thiệu +70000, vui lòng đợi hệ thống thanh toán nhé" })
        }
    }
    else {
        res.send({ error: true, message: "Mã này không tồn tại" })
    }
})
app.post('/getCodeGioiThieu', async (req, res) => {
    let sdt = req.body.sdt
    if (checkPhoneValid(sdt)) {
        sdt = ChangeNumber11(sdt)
    }
    else {
        return res.send({ error: true, message: "SDT không hợp lệ" })
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    console.log("gt " + sdt)
    const momo = await Momos.findOne({ phone: sdt })
    if (momo) {
        res.send({ error: true, message: "Số của hệ thống" })
    }
    else {
        const cuoc = await Cuocs.findOne({ time: { $gte: startOfToday }, sdtchuyen: sdt, tiencuoc: { $gte: 10000 } })
        if (cuoc) {
            const codeee = await GioiThieu.findOne({ sdt: sdt })
            if (codeee) {
                res.send({ error: false, message: "ok", data: { code: codeee.code } })
            }
            else {
                const codeRan = getCodeRan()
                const zzz = await new GioiThieu({ code: codeRan, sdt: sdt, totalGift: 0 }).save()
                res.send({ error: false, message: "ok", data: { code: zzz.code } })
            }
        }
        else {
            res.send({ error: true, message: "Hôm nay bạn cần chơi 10k để tạo mã nhé" })
        }
    }
})

let checkPhoneValid = function (phone) {
    return /^[\+]?(?:[(][0-9]{1,3}[)]|(?:84|0))[0-9]{7,10}$/im.test(phone);
}


getGame = (nd) => {
    try {
        nd = nd.toString().toUpperCase()
    }
    catch {

    }
    if (nd == "a" || nd == "b" || nd == "A" || nd == "B" || nd == "C" || nd == "L") {
        return "Chẵn lẻ"
    }
    else if (nd == "T" || nd == "X" || nd == "t" || nd == "x") {
        return "Tài xỉu"
    }
    else if (nd == "A2" || nd == "B2" || nd == "a2" || nd == "b2" || nd == "T2" || nd == "X2" || nd == "t2" || nd == "x2" || nd == "C2" || nd == "L2") {
        return "Chẵn lẻ 2"
    }
    else if ((nd == "g3" || nd == "G3")) {
        return "Gấp 3"
    }
    else if ((nd == "s" || nd == "S")) {
        return "Tổng 3 số"
    }
    else if ((nd == "N1" || nd == "n1")) {
        return "Gấp 3"
    }
    else if ((nd == "N2" || nd == "n2")) {
        return "Gấp 3"
    }
    else if ((nd == "N3" || nd == "n3")) {
        return "Gấp 3"
    }
    else if ((nd == "CX" || nd == "LT" || nd == "CT" || nd == "LX")) {
        return "Xiên"
    }
    else if ((nd == "D0" || nd == "D1" || nd == "D2" || nd == "D3" || nd == "D4" || nd == "D5" || nd == "D7" || nd == "D8" || nd == "D9")) {
        return "Đoán số"
    }
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

app.get('/game', async (req, res) => {
    const setting = await Setting.findOne({})
    const momo = await Momos.find({ status: 1 })
    let phone = []
    momo.forEach((element) => {
        phone.push({ id: element._id, max: Math.round(element.gioihanngay), solan: element.solan, cuoc_min: setting.tile.min, cuoc_max: setting.tile.max, phone: element.phone, thoigian: "Hoạt động" })
    })

    const cuoc = await Cuocs.find({ status: 1 }).limit(5).sort({ time: -1 })
    let cuocs = []
    cuoc.forEach((element) => {
        cuocs.push({ id: element._id, thoigian: "", phone: element.sdtchuyen.substring(0, element.sdtchuyen.length - 4) + "****", tien: element.tiencuoc, tienthang: Math.round(element.tienthang), game: getGame(element.noidung), text: element.noidung })
    })
    let toptuans = []
    const toptuan = await TopTuan.find({}).limit(5).sort({ win: -1 })
    for (let i = 0; i < toptuan.length; i++) {
        toptuans.push({ i: i + 1, phone: toptuan[i].sdt.substring(0, toptuan[i].sdt.length - 4) + "****", win: Math.round(toptuan[i].win) })
    }
    const zzz = {
        "author": {
            "time": 1643246654,
            "id": "MoMo API",
            "LoiBinh": "zzz",
            "about": "HK05",
            "Ver": "1.0",
            "Contact": "zzz",
            "Success": "true"
        },
        "phone": phone,
        "play": cuocs,
        "top": toptuans,
        "hu": "500000",
        "nohu": [],
        "baotri": "2",
        "thongbao": setting.thongbao,
        "huongdan": setting.huongdan
    }
    res.send(zzz)
})

app.get("/showTaskDay", async (req, res) => {
    const zzz = await SendTaskDay.find({}).sort({ time: -1 }).limit(50)
    res.send(zzz)
})

app.post("/v2/thamgia.json", async (req, res) => {
    const phone = req.body.phone
    console.log(phone)
    const checktask = await DayTask.findOne({ sdt: phone })
    if (!checktask) {
        res.send({ error: 5 })
    }
    else {
        res.send({ error: 2, name: checktask.name, totalPlay: checktask.totalPlay, moc: checktask.moc })
    }
})
app.post("/v2/nhanthoi.json", async (req, res) => {
    const phone = req.body.phone
    let thuongs = [0, 250000, 170000, 85000, 42000, 21000];
    let choi = [0, 45000000, 29000000, 12000000, 5000000, 1000000];
    let checktask = await DayTask.findOne({ sdt: phone })
    if (checktask) {
        console.log(checktask.totalPlay, choi[checktask.moc])
        if (checktask.totalPlay >= choi[checktask.moc]) {
            const thuong = thuongs[checktask.moc]
            checktask.moc -= 1
            checktask.save()
            await SendTaskDay({ phone: phone, money: thuong }).save()
            res.send("<b style='color:red'>Nhận quà thành công vui lòng đợi trong giây lát để được thanh toán</b>")
        }
        else {
            res.send("<b style='color:red'>Vui lòng chơi đủ yêu cầu</b>")
        }
    }
})


const bot = require("./telegram/botadmin");
app.post('/tele', async (req, res, next) => {
    try {
        await bot.sendMessage(-645203490, "co tin nhan moi\n" + req.body.visitor.name + "\n" + req.body.message.text)
    }
    catch {
        await bot.sendMessage(-645203490, "co tin nhan moi\n" + JSON.stringify(req.body))
    }
    res.send("ok")
});

const CheckMagd = require("./controllers/CheckmaGd");
app.post("/checkMagd", CheckMagd.CheckMa)
const server = require('http').createServer(app);
server.listen(5555, () => console.log('Server Running on port 5555'));