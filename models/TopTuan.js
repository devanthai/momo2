const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    sdt:{
        type:String
    },
    win:{
        type:Number
    }
})
module.exports = mongoose.model('Toptuan',userSchema)