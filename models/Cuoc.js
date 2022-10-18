const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    sdt: {
        type: String
    },
    sdtchuyen: {
        type: String
    }
    ,
    name: {
        type: String
    }
    ,
    magd: {
        unique: true,
        type: String
    }
    ,
    tiencuoc: {
        type: Number
    }
    ,
    tienthang: {
        type: Number
    }
    ,
    status: {
        type: Number
    }
    ,
    sodu: {
        type: Number
    }
    ,
    noidung: {
        type: String
    }
    ,
    time: {
        type: Date,
        default: Date.now
    },
    timesError: {
        type: Number,
        default: 0
    }
})
module.exports = mongoose.model('Cuoc', userSchema)