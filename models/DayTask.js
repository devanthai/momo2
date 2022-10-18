const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    sdt: {
        type: String
    },
    name: {
        type: String
    },
    totalPlay: {
        type: Number
    },
    moc: {
        default:5,
        type: Number
    }
})
module.exports = mongoose.model('DayTask', userSchema)