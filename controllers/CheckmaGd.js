const MomoService = require('./momo.service');
const Momo = require('../models/momo.model')
const Lichsuck = require('../models/LichSuCk')
const Cuocs = require('../models/Cuoc')
const Setting = require('../models/Setting')
const AutoMomo = require('./autoMomo');

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

CheckMa = async (req, res) => {
    const setting = await Setting.findOne({})
    const { ma, phone } = req.body
    await deleteMagdRedis(ma)
    const momo = await Momo.findOne({ phone: phone })
    if (!momo) {
        return res.send("2")
    }
    else if (momo.status == 1) {
        return res.send("4")
    }
    else {
        const dateString = new Date().toLocaleDateString()
        await AutoMomo.CheckGd(momo, dateString, setting, 50)
        let checkls = await Cuocs.findOne({ magd: ma })
        if (checkls && checkls.status == -1) {
            const checkMomo = await Momo.findOne({ status: 1 })
            if (checkMomo) {
                checkls.sdt = checkMomo.phone
                checkls.save()
                return res.send("1")
            }
            else {
                return res.send("9")
            }
        }
        else if (checkls && checkls.status != -1) {
            return res.send("0")
        }
        else {
            await MomoService.GENERATE_TOKEN(momo, momo.phone)
            const notis = await MomoService.getNoti(phone, 1000000)
            if (notis.length == 0) {
                return res.send("3")
            }
            else {
                checkls = await Cuocs.findOne({ magd: ma })
                if (checkls) {
                    return res.send("0")
                }
                else {
                    const indexP = notis.findIndex(noti => noti.tranId == ma)
                    if (indexP != -1) {
                        const notiMomo = notis[indexP]
                        const zzmomo = await Momo.findOne({ status: 1 })
                        if (zzmomo) {
                            await new Lichsuck({ sdt: zzmomo.phone, sdtchuyen: notiMomo.partnerId, name: notiMomo.partnerName, magd: notiMomo.tranId, sotien: notiMomo.amount, io: 1, noidung: notiMomo.comment, status: 1 }).save()
                            const mwin = getWin(notiMomo.amount, notiMomo.comment, notiMomo.tranId, setting)
                            await new Cuocs({ sdt: zzmomo.phone, sdtchuyen: notiMomo.partnerId, name: notiMomo.partnerName, magd: notiMomo.tranId, tiencuoc: notiMomo.amount, tienthang: mwin, status: mwin <= 0 ? 2 : -1, sodu: 999, noidung: notiMomo.comment }).save()
                            if (mwin <= 0) {
                                res.send("7")
                            }
                            else {
                                res.send("1")
                            }
                        }
                        else {
                            res.send("777")
                        }
                    }
                    else {
                        res.send("3")
                    }
                }
            }
        }
    }
}
module.exports = { CheckMa }