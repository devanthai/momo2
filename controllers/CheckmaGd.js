const MomoService = require('./momo.service');
const Momo = require('../models/momo.model')
const Lichsuck = require('../models/LichSuCk')
const Cuocs = require('../models/Cuoc')
const Setting = require('../models/Setting')
const AutoMomo = require('./autoMomo');
const DayTask = require('../models/DayTask')

const redisCache = require("../redisCache")

const keyMomo = "momoMagd"
const getWin = require("./getWin")

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
CheckMa = async (req, res) => {
    const setting = await Setting.findOne({})
    const { ma, phone } = req.body
    await deleteMagdRedis(ma)
    const momo = await Momo.findOne({ phone: phone })
    if (!momo) {
        return res.send({ error: true, message: "Lỗi: hệ thống không có số này!" })
    }
    else {
        const zzmomo = await Momo.findOne({ status: 1 })

        let checkls = await Cuocs.findOne({ magd: ma })
        if (checkls) {
            if (checkls.status == 1) {
                return res.send({ error: true, message: "Lỗi: Mã này bạn đã thắng và đã trả thưởng!" })
            }
            else if (checkls.status == 2) {
                return res.send({ error: true, message: "Lỗi: Mã này bạn đã thua!" })
            }
            else if (checkls.status == -1) {

                if (!zzmomo) {
                    return res.send({ error: true, message: "Lỗi: hệ thống hết số vui lòng thử lại sau!" })
                }
                else {
                    checkls.sdt = zzmomo.phone
                    checkls.save()
                    return res.send({ error: false, message: "Hệ thống sẽ trả thưởng cho bạn sau vài giây!" })
                }
            }
            else {
                return res.send({ error: true, message: "Lỗi: Mã này đang xử lý vui lòng chờ trong giây lát. mã lỗi:" + checkls.status })
            }
        }
        else {
            await MomoService.GENERATE_TOKEN(momo, momo.phone)
            try {
                const data = await MomoService.getTranId(momo.phone, ma);
                if (data) {
                    const partnerId = data.partnerId
                    const io = data.io
                    const transId = data.transId
                    const partnerName = data.partnerName
                    const amount = data.amount
                    let comment = data.comment
                    const postBalance = data.postBalance
                    if (comment == undefined) comment = "undefined"


                    if (momo.status == 0 && !zzmomo) {
                        return res.send({ error: true, message: "Lỗi: Hệ thống hết số vui lòng thử lại sau:" })
                    }

                    let sdtMain = momo.status == 1 ? momo.phone : zzmomo.phone
                    await new Lichsuck({ sdt: sdtMain, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: transId, sotien: amount, io: io, noidung: comment, status: 1 }).save()
                    let mwin = getWin(amount, comment, transId, setting)
                    if (io == 1) {
                        const checkzz2 = await Cuocs.findOne({ magd: transId })
                        if (!checkzz2) {
                            if (comment == "undefined") {
                                await new Cuocs({ sdt: sdtMain, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: transId, tiencuoc: amount, tienthang: mwin, status: -999, sodu: postBalance, noidung: comment }).save()
                            }
                            else if (mwin != 0) {
                                await new Cuocs({ sdt: sdtMain, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: transId, tiencuoc: amount, tienthang: mwin, status: -1, sodu: postBalance, noidung: comment }).save()
                            }
                            else {
                                await new Cuocs({ sdt: sdtMain, sdtchuyen: ChangeNumber11(partnerId), name: partnerName, magd: transId, tiencuoc: amount, tienthang: mwin, status: 2, sodu: postBalance, noidung: comment }).save()
                            }
                        }
                        const zzz = await DayTask.findOneAndUpdate({ sdt: ChangeNumber11(partnerId) }, { $inc: { totalPlay: amount } })
                        if (!zzz) {
                            await new DayTask({ name: partnerName, sdt: ChangeNumber11(partnerId), totalPlay: amount }).save()
                        }
                    }
                    if (mwin > 0) {
                        return res.send({ error: false, message: "Hệ thống sẽ thanh toán cho bạn sau vài giây" })
                    }
                    else {
                        return res.send({ error: true, message: "Mã này đã kiểm tra mã đã thua" })
                    }
                }
                else {

                    return res.send({ error: true, message: "Lỗi: Không tìm thấy mã này vui lòng kiểm tra lại!" })
                }
            } catch (ex) { 
                console.log(ex); 
                if(ex.toString().include("Không tìm thấy mã gd này"))
                {
                    return res.send({ error: true, message: "Lỗi: Không tìm thấy mã này vui lòng kiểm tra lại!" }) 
                }
                return res.send({ error: true, message: "Lỗi: Lỗi không xác định vui lòng thử lại!" }) 
            }
        }
    }
}
module.exports = { CheckMa }