const mongoose = require('mongoose');
const Lichsu = new mongoose.Schema({
    sdt: {
        type: String
    },
    sdtchuyen: {
        type: String
    },
    name: {
        type: String
    },
    magd: {
        unique: true,
        type: String
    },
    noidung: {
        type: String
    },
    sotien: {
        type: Number,
        default: 0
    },
    sodu: {
        type: Number,
        default: 0
    },
    io: {
        type: Number

    },
    status: {
        type: Number,
        default: 0

    },
    time: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Lichsuck', Lichsu)