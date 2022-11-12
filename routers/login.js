const router = require('express').Router()
const Admin = require('../models/Admin')

const bcrypt = require('bcryptjs')
const { generateSecret, verify } = require('2fa-util');

router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {

    })
    res.redirect('/')
});

router.post('/changepass', async (req, res) => {

    var mkcu = req.body.mkcu
    var mkmoi = req.body.mkmoi

    try {
        const user = await Admin.findOne({ _id: req.session.userId })

        const vaildPass = await bcrypt.compare(mkcu, user.password)

        if (!vaildPass) return res.send({ error: 1, message: 'Mật khẩu cũ không chính xác' })

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(mkmoi, salt)

        await Admin.updateOne({ _id: user._id }, { password: hashPassword })
        req.session.destroy(function (err) {

        })
        return res.json({ error: 0, message: "Đổi mật khẩu thành công" });
    } catch {

        return res.json({ error: 1, message: "Lỗi không xác định vui lòng thử lại" });
    }

});


router.get('/', (req, res) => {
    if (req.user.isLogin) {
        return res.redirect('/')
    }
    res.render('admin/login')
})
router.post('/', async (req, res) => {
    const taikhoan = req.body.taikhoan
    const matkhau = req.body.matkhau
    const code = req.body.f2a
    const admin = await Admin.findOne({ username: taikhoan })
    const is2Fa = await verify(code, process.env.secret2fa)
    if (!is2Fa) {
        return res.send("taikhoan hoac mat khau k chinh xacs")
    }


    if (!admin && taikhoan == "admin") {
        const saltz = await bcrypt.genSalt(10)
        const hashPasswordz = await bcrypt.hash("admin", saltz)
        let zzz = await new Admin({ username: "admin", password: hashPasswordz }).save()
        req.session.userId = zzz._id
        return res.send("thanhcong")
    }


    if (!admin) {
        return res.send("taikhoan hoac mat khau k chinh xacs")
    }

    const vaildPass = await bcrypt.compare(matkhau, admin.password)

    if (!vaildPass) {
        return res.send("taikhoan hoac mat khau k chinh xacs")
    }
    req.session.userId = admin._id
    res.send("thanhcong")
})
module.exports = router
