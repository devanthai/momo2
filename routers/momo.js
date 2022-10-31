const app = require('express').Router()
const MomoService = require('../controllers/momo.service');
const Setting = require('../models/Setting');
const Momo = require('../models/momo.model');
const Lichsuck = require('../models/LichSuCk');
const Cuocs = require('../models/Cuoc');
const moment = require('moment')
const checklogin = require('./checklogin')
const login = require('./login')
function numberWithCommas(x) {
    try {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    catch {
        return 0
    }
}
app.use(checklogin)
app.use('/auth', login)
app.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    res.render("admin/index", { page: "views/trangchu", data: req.user })
})

app.get('/setting', async (req, res) => {
    setting = await Setting.findOne({})
    if (!setting) {
        await new Setting({ setting: "Setting" }).save()
    }
    res.render("admin/index", { page: "views/setting", data: req.user })
})
app.post('/addsdt2', async (req, res) => {
    const zzz = req.body.textarraymm
    var toarray = JSON.parse(zzz)
    //  console.log(toarray.phone)
    try {
        await new Momo({
            phone: toarray.phone,
            gioihan: toarray.gioihan,
            gioihanngay: toarray.gioihanngay,
            gioihanthang: toarray.gioihanthang,
            imei: toarray.imei,
            name: toarray.name,
            pass: toarray.pass,
            solan: toarray.solan,
            sotien: toarray.sotien,
            status: toarray.status,
            phash: toarray.phash,
            setupKey: toarray.setupKey,
            refresh_token: toarray.refresh_token,
            token: toarray.token
        }).save()
    }
    catch {

    }
    res.send("ok")
})

app.post('/setting', async (req, res) => {
    try {
        let {
            sdtGioithieu,
            sdtGiftcode,
            ToMuchMoneySdt,
            Moneynhieutien,
            PhoneMoney,
            MaxMoneyPhone,
            sdtdaytask,
            thongbao,
            tieude,
            linktelegram,
            linklogo,
            settingtile
        } = req.body

        settingtile = JSON.parse(settingtile)

        await Setting.findOneAndUpdate({}, {
            tile: settingtile,
            thongbao: thongbao,
            tieude: tieude,
            sdtGiftcode: sdtGiftcode,
            sdtGioithieu: sdtGioithieu,
            linkTele: linktelegram,
            linklogo: linklogo,
            sdtdaytask: sdtdaytask,
            "SendMoneyMy.Phone": PhoneMoney,
            "SendMoneyMy.MaxMoney": MaxMoneyPhone,
            "ToMuchMoney.Phone": ToMuchMoneySdt,
            "ToMuchMoney.MaxMoney": Moneynhieutien,
        })
        res.send("ok")
    } catch (ex) {
        res.send("error " + ex.message)
    }
})


app.post('/TransFerSpam', async (req, res) => {
    var { Phone, PhoneTransFer, Content } = req.body
    try {

        const data = await MomoService.Comfirm_oder(Phone, PhoneTransFer, 100, Content);
        res.send({
            success: true,
            message: 'Spam thành công tới số ' + PhoneTransFer,
            data
        })
    }
    catch (e) {
        try {
            const findSdt = await Momo.findOne({ phone: Phone })
            if (findSdt) {
                await MomoService.GENERATE_TOKEN(findSdt, Phone)
            }
        }
        catch { }
        res.send({
            success: false,
            message: e.message
        })
    }
})


app.post('/chuyentien', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({
            success: true,
            message: 'Vui lòng đăng nhập lại (F5)'
        })
    }
    var { sdt, id, sotien, noidung, pass } = req.body
    var momo = await Momo.findById(id)
    if (momo) {
        if (momo.pass == pass) {
            try {
                const data = await MomoService.Comfirm_oder(momo.phone, sdt, Number(sotien), noidung);
                momo.gioihanthang += Number(sotien)
                momo.gioihanngay += Number(sotien)
                momo.save()
                res.send({
                    success: true,
                    message: 'Thành công',
                    data
                })
            }
            catch (e) {
                res.send({
                    success: false,
                    message: e.message
                })
            }
        }
        else {
            res.send({
                success: false,
                message: "Sai Mật khẩu"
            })
        }
    }
})

app.get('/chuyentien', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    var id = req.query.id
    var momo = await Momo.findById(id)
    if (momo) {




        var html = `  <div class="alert alert-primary" role="alert">
        <label for="">Số diện thoại chuyển: <b style="color:red">`+ momo.phone + " (" + momo.name + ") - " + " Số dư: " + numberWithCommas(momo.sotien) + `</b></label>
                  <br>
                  <label for="">Số diện thoại</label>
                  <input type="text" name="" id="sdt">
                  <br>
                  <label for="">Số tiền</label>
                  <input type="text" name="" id="sotien">
                  <br>
                  <label for="">Nội dung</label>
                  <input type="text" name="" id="noidung">
                  <br>
                  <label for="">Mật khẩu</label>
                  <input type="text" name="" id="pass">
                  <br>
                  <div id="thongbaock"></div>
                  <button class="btn btn-primary" onclick="chuyetien('`+ momo._id + `')">Chuyển ngay</button>
      </div>
            <script>
      function chuyetien(id) {

        $.ajax({
            url: "/chuyentien",
            type: "post",
            data: {
                id:id,
                sdt: $('#sdt').val(),
                sotien: $('#sotien').val(),
                noidung: $('#noidung').val(),
                pass: $('#pass').val()
            },
            success: function (result) {
                if(result.success)
                {
                    $("#thongbaock").html('<div class="alert alert-success" role="alert">'+result.message+'</div>')
                }
                else
                {
                    $("#thongbaock").html('<div class="alert alert-danger" role="alert">'+result.message+'</div>')
                }

            }
        });

    }
    </script>
        `
        return res.render('admin/index2', { page: html })
    }
    res.send("loi khong xac dinh")
})

app.get("/thanhcongcuoc", async (req, res) => {
    var magd = req.query.magd
    const zzz = await Cuocs.findOneAndUpdate({ magd: magd }, { status: 1 })
    res.send(zzz)
})

app.get('/chitietlichsu', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    const tranId = req.query.tranid
    const phone = req.query.phone
    try {
        const data = await MomoService.getTranId(phone, tranId);

        var html = ""
        if (data.io == -1) {


            html += `<div class="alert alert-danger" role="alert">Số điện thoại: ` + data.phone + `<br>Mã giao dịch: ` + data.transId + "<br>Chuyển tiền cho " + data.targetName + " (" + data.targetId + ")" + "<br>Số tiền: " + numberWithCommas(data.amount) + "<br>Số Dư: " + numberWithCommas(data.postBalance) +

                `<br>Nội dung: ` + data.comment + "<br>Thời gian: " + new Date(data.time).toLocaleString() +
                `  </div>`

        }
        else {
            html += `<div class="alert alert-success" role="alert">Số điện thoại: ` + data.phone + `<br>Mã giao dịch: ` + data.transId + "<br>Nhận tiền từ " + data.partnerName + " (" + data.partnerId + ")" + "<br>Số tiền: " + numberWithCommas(data.amount) + "<br>Số Dư: " + numberWithCommas(data.postBalance) +

                `<br>Nội dung: ` + data.comment + "<br>Thời gian: " + new Date(data.time).toLocaleString() +
                `  </div>`
        }
        html += "<br>" + JSON.stringify(data.serviceData)
        console.log(data)
        res.render("admin/index2", { page: html })

    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }

})
app.get('/lichsu', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    const id = req.query.id
    var momo = await Momo.findById(id)
    var date = new Date().toLocaleDateString('en-GB').replaceAll('/', '-')

    try {
        const data = await MomoService.getTranshis(momo.phone, date, date, 100);


        var html = ""
        if (data.message == "successfuly" && data.momoMsg) {
            //console.log(data.momoMsg)
            data.momoMsg.forEach(async (ls) => {
                if (ls.status == 6) {
                    if (ls.io == -1) {
                        html += `<div class="alert alert-warning" role="alert">Mã giao dịch: ` + ls.transId + `<br>Chuyển tiền cho: ` + ls.targetName + " (" + ls.targetId + ")" + "<br>Số tiền: " + numberWithCommas(ls.totalAmount) +

                            `<br><a href="/chitietlichsu?phone=` + momo.phone + `&tranid=` + ls.transId + `" target="_blank">Xem chi tiết</a>` +
                            `  </div>`
                    }
                    else if (ls.io == 1) {

                        html += `<div class="alert alert-warning " role="alert">Mã giao dịch: ` + ls.transId + `<br>Nhận tiền từ: ` + ls.sourceName + " (" + ls.sourceId + ")" + "<br>Số tiền: " + numberWithCommas(ls.totalAmount) + `<br><a href="/chitietlichsu?phone=` + momo.phone + `&tranid=` + ls.transId + `" target="_blank">Xem chi tiết</a>` + `  </div>`
                    }
                }
                else if (ls.io == -1) {
                    html += `<div class="alert alert-danger" role="alert">Mã giao dịch: ` + ls.transId + `<br>Chuyển tiền cho: ` + ls.targetName + " (" + ls.targetId + ")" + "<br>Số tiền: " + numberWithCommas(ls.totalAmount) +

                        `<br><a href="/chitietlichsu?phone=` + momo.phone + `&tranid=` + ls.transId + `" target="_blank">Xem chi tiết</a>` +
                        `  </div>`
                }
                else if (ls.io == 1) {

                    html += `<div class="alert alert-success " role="alert">Mã giao dịch: ` + ls.transId + `<br>Nhận tiền từ: ` + ls.sourceName + " (" + ls.sourceId + ")" + "<br>Số tiền: " + numberWithCommas(ls.totalAmount) + `<br><a href="/chitietlichsu?phone=` + momo.phone + `&tranid=` + ls.transId + `" target="_blank">Xem chi tiết</a>` + `  </div>`
                }


                // console.log(ls)
                //   }
            })
        }
        res.render('admin/index2', { page: html })

    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }


})

app.get('/lichsu2', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    const id = req.query.id
    var momo = await Momo.findById(id)
    //    var date = new Date().toLocaleDateString('en-GB').replaceAll('/', '-')

    try {
        const data = await MomoService.getNoti2(momo.phone, 1000000);

        let htmlNoti = data.map(item => `<div class="alert alert-success " role="alert">Mã giao dịch: ` + item.tranId + `<br>Info: ` + JSON.parse(item.extra).partnerName + " (" + item.sender + ")" + "<br>Số tiền: " + JSON.parse(item.extra).amount + "<br>Nội dung: " + JSON.parse(item.extra).comment + "<br>Caption: " + item.caption + `</div>`)


        res.render('admin/index2', { page: htmlNoti.join('') })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }


})


app.post('/search', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ error: 1, message: "Vui long dang nhap" })
    }

    var magd = req.body.magd
    var finddd = await Lichsuck.findOne({ magd: magd })
    if (finddd) {
        var html = `
    <tr>
    <td scope="col">
        `+ new Date(Date.parse(finddd.time)).toLocaleString() + `

    </td>

    <td scope="col">
    `+ finddd.sdtchuyen + `
    </td>
    <td scope="col">
    `+ finddd.magd + `
    </td>
    <td scope="col">
    `+ finddd.name + `
    </td>
    <td scope="col">
    `+ finddd.sdt + `
    </td>
    <td scope="col">
    `+ String(finddd.sotien).replace(/(.)(?=(\d{3})+$)/g, '$1,') + `
    </td>
    <td scope="col">
    `+ finddd.noidung + `
    </td>
    <td scope="col">


        <a href="/chitietlichsu?phone=`+ finddd.sdtchuyen + `&tranid=` + finddd.magd + `"
            target="_blank">Xem chi tiết</a>
    </td>



</tr>
`
        res.send({ error: 0, table: html })

    }
    else {
        res.send({ error: 1, message: "Khoong tim thay" })

    }


})
app.post('/battat', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send("Vui lòng đăng nhập lại")
    }
    var id = req.body.id
    var isbattat = req.body.isbat
    if (isbattat == "Tắt") {

        await Momo.findByIdAndUpdate(id, { status: 0 })
    }
    else {

        await Momo.findByIdAndUpdate(id, { status: 1 })
    }
    res.send('ok')

})
app.post('/xoa', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send("Vui lòng đăng nhập lại")
    }
    var id = req.body.id
    await Momo.deleteOne({ _id: id })
    res.send('ok')
})
app.post('/gentoken', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send("Vui lòng đăng nhập lại")
    }
    var id = req.body.id
    const momo = await Momo.findOne({ _id: id })
    if (momo) {
        const zzz = await MomoService.GENERATE_TOKEN(momo, momo.phone)
        console.log(zzz)
    }
    res.send('ok')
})


app.post('/reset', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    var id = req.body.id
    var momo = await Momo.findOne({ _id: id })
    if (momo) {
        momo.gioihanthang = 0
        momo.save()
    }
    res.send('ok')
})

app.post('/getBalance', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    var id = req.body.id
    var momo = await Momo.findOne({ _id: id })
    if (momo) {
        const zzz = await MomoService.getBalance(momo.phone)
        console.log(zzz)
    }
    res.send('ok')
})

app.get('/resetThang', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    var momo = await Momo.updateMany({}, { gioihanthang: 0 })
    res.send('ok')
})
const timerz = ms => new Promise(res => setTimeout(res, ms))

app.get('/getBalanceall', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    var momo = await Momo.find({})
    momo.forEach(async (element) => {
        const zzz = await MomoService.getBalance(element.phone)
        await timerz(1500)

        console.log(zzz)
    })
    res.send('ok')
})
app.get('/TokenAll', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    var momo = await Momo.find({})
    momo.forEach(async (element) => {
        const zzz = await MomoService.GENERATE_TOKEN(element, element.phone)
        console.log(zzz)
    })
    res.send('ok')
})
app.get('/loginAll', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    var momo = await Momo.find({})
    momo.forEach(async (element) => {
        const zzz = await MomoService.login(element.phone)
        console.log(zzz)
    })
    res.send('ok')
})
app.post('/getuser', async (req, res) => {

    var id = req.body.id
    var momo = await Momo.findOne({ _id: id })
    if (momo) {
        try {
            //const zzz = await MomoService.login(momo.phone);
            const zzz = await MomoService.getNoti(momo.phone, 1000)
            console.log(zzz)

        } catch (ex) {
            console.log(ex)
        }
    }
    res.send('ok')
})

app.get('/spamMomo', async (req, res) => {

    var listSDT = ""

    const momos = await Momo.find({})

    momos.forEach((item) => {
        listSDT += item.phone + "\n"
    })

    var page = "views/spamMomo"

    res.render("admin/index", { page: page, listSDT })
})

app.get('/managerphone', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    var tongtien = 0
    if (req.query.load == true) {
        var zzzzz = await Momo.find({})
        for (let i = 0; i < zzzzz.length; i++) {
            try {
                await MomoService.getBalance(zzzzz[i].phone)
            }
            catch {
                await Momo.findOneAndUpdate({ _id: zzzzz[i]._id }, { sotien: -999999 })
            }
        }
    }
    var momos = await Momo.find({}).sort({ status: -1 })
    var htmlsdt = ""
    for (let i = 0; i < momos.length; i++) {

        if (momos[i].sotien != -999999) {
            tongtien += momos[i].sotien;
        }
        htmlsdt += `
        <tr>
                            <td scope="col">
                                `+ i + `
                            </td>
                            <td scope="col">
                                `+ momos[i].name + `
                            </td>
                            <td scope="col">
                            `+ numberWithCommas(momos[i].sotien) + `
                            </td>
                            <td scope="col">
                                `+ momos[i].phone + `
                            </td>
                            <td scope="col">
                                `+ numberWithCommas(momos[i].gioihanngay) + `
                            </td>
                            <td scope="col">
                            `+ numberWithCommas(momos[i].gioihanthang) + `
                        </td>
                            <td scope="col">
                                `+ (momos[i].status == 1 ? "<b style='color:green;'>Đang hoạt động</b>" : "<b>Đang tắt</b>") + `
                            </td>
                            <td scope="col">
                                `+ momos[i].solan + `
                            </td>
                            <td scope="col"> `+ new Date(momos[i].createdAt).toLocaleString() + `</td>

                            <td scope="col">
                            `+ momos[i].agentId + `
                        </td>

                            <td scope="col"> 
                          
                            <button id="aaa" onclick="getuser('`+ momos[i]._id + `',this)">Test</button>

                                <button id="battat" onclick="battat('`+ momos[i]._id + `',this)">` + (momos[i].status == 1 ? "Tắt" : "Bật") + `</button>
                                <button onclick="window.open('/lichsu?id=`+ momos[i]._id + `')">Xem lịch sử</button>
                                <button onclick="window.open('/lichsu2?id=`+ momos[i]._id + `')">ls2</button>
                                <button onclick="window.open('/chuyentien?id=`+ momos[i]._id + `')">Chuyển tiền</button>
                               <button onclick="xoa('`+ momos[i]._id + `')">Xóa</button>
                               <button onclick="gentoken('`+ momos[i]._id + `')">Renew Token</button>
                            </td>
                          
                        </tr>
                        `
    }

    var page = "views/managerphone"
    res.render("admin/index", { tongtien: numberWithCommas(tongtien), page: page, listsdt: htmlsdt })
})
app.get('/lichsuck', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }
    var now = new Date();
    var DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
    var data = await Lichsuck.find({ time: { $gte: DATE } }).sort({ 'time': -1 });
    res.render('admin/index', { page: "views/lichsuchuyentien", data: req.user, products: data })
})


app.get('/lichsucuocs', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/auth/')
    }

    var now = new Date();
    var DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 2));
    var data = await Cuocs.find({ time: { $gte: DATE } }).sort({ 'time': -1 });
    res.render('admin/index', { page: "views/lscuoc", data: req.user, products: data })
})



app.post('/KYC', async (req, res) => {
    const { phone, targetPhone } = req.body;
    const data = await MomoService.createRoom(phone, targetPhone);
    if (!data.error) {
        const getroom = await MomoService.getRoom(phone, targetPhone);
        if (!getroom.error) {
            if (getroom.data.json.room.warningType == "NO_KYC") {
                res.send({ error: false, kyc: false, data: getroom.data })
            }
            else {
                res.send({ error: false, kyc: true, data: getroom.data })
            }
        }
        else {
            res.send({ error: true, data: getroom })
        }
    }
    else {
        res.send({ error: true, data: data })
    }
})



app.post('/api/momo/getUser', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const data = await MomoService.getUser(phone);
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
})
app.post('/api/momo/getOTP', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const data = await MomoService.GET_OTP(phone, password);
        // console.log(data)
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {

        res.send({
            success: false,
            message: e.message
        })
    }
})
app.post('/api/momo/Relogin', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const data = await MomoService.Re_Login(phone, password);
        // console.log(data)
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {

        res.send({
            success: false,
            message: e.message
        })
    }
})
app.post('/api/momo/checkOTP', async (req, res) => {
    const { phone, otp } = req.body;
    try {
        const data = await MomoService.Check_OTP(phone, otp);
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
})
app.post('/api/momo/getNoti', async (req, res) => {
    const { phone, begin } = req.body;
    try {
        let day = begin || 86400;
        const data = await MomoService.getNoti(phone, day);
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
})
app.post('/api/momo/checkTranId', async (req, res) => {
    const { phone, tranId } = req.body;
    try {
        const data = await MomoService.getTranId(phone, tranId);
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
})
app.post('/api/momo/getTransactions', async (req, res) => {
    const { phone, begin, end, limit } = req.body;
    try {
        const data = await MomoService.getTranshis(phone, begin, end, limit);
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
})
app.post('/api/momo/getTransp2p', async (req, res) => {
    const { phone, begin, end, limit } = req.body;
    console.log(req.body)
    try {
        const data = await MomoService.Transhis_p2p(phone, begin, end, limit);
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
})
app.post('/api/momo/getBalance', async (req, res) => {
    const { phone } = req.body;
    try {
        const data = await MomoService.getBalance(phone);
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
})
app.post('/api/momo/transfer', async (req, res) => {
    const { phone, sdt, amount, comment } = req.body;
    try {

        const data = await MomoService.Comfirm_oder(phone, sdt, amount, comment);
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
})
app.get('/api/momo/test', async (req, res) => {

    try {

        const data = await MomoService.test();
        res.send({
            success: true,
            message: 'Thành công',
            data
        })
    }
    catch (e) {
        res.send({
            success: false,
            message: e.message
        })
    }
})
module.exports = app