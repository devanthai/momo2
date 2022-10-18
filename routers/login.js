const router = require('express').Router()
const Admin = require('../models/Admin')

const bcrypt = require('bcryptjs')

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

router.get('/add', async (req, res) => {
    const saltz = await bcrypt.genSalt(10)
    // const hashPasswordz = await bcrypt.hash("m@1", saltz)
    // await new Admin({ username: "a", password: hashPasswordz }).save()
    // const hashPasswordzzz = await bcrypt.hash("t9@", saltz)
    // await new Admin({ username: "t9", password: hashPasswordzzz }).save()
     const hashPasswordz = await bcrypt.hash("zzzzzzz", saltz)
    await new Admin({ username: "zzzzzzz", password: hashPasswordz }).save()
    res.send("cccc")
})
router.get('/', (req, res) => {
    if (req.user.isLogin) {
        return res.redirect('/')
    }
    res.render('admin/login')
})
router.post('/', async (req, res) => {
    const taikhoan = req.body.taikhoan
    const matkhau = req.body.matkhau
    const admin = await Admin.findOne({ username: taikhoan })

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
