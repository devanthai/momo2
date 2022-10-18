const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    sdt: {
        type: String
    },
    code: {
        type: String
    },
    totalGift: {
        type: Number
    }
})
module.exports = mongoose.model('GioiThieu', userSchema)