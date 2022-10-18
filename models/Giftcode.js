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
    }
})
module.exports = mongoose.model('Giftcode', userSchema)