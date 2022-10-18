const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    status: {
        type: Number,
        default: -1
    },
    phone: {
        type: String,
    },
    money: {
        type: Number,
    },
    time: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('SendGioiThieu', userSchema)