const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: {
        type: String
    },
    amount: {
        type: Number
    }
    ,
    time: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('HistoryDiemDanh', userSchema)