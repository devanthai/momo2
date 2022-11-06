const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        default: null
    },
    code: {
        type: String
    },
    money: {
        type: Number
    },
    status: {
        type: Number,
        default: -1
    },
    time: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Giftcode', userSchema)