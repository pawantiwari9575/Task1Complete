const mongoose = require("mongoose");


var tweetsSchema = mongoose.Schema({
    caption : String,
    likes :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    time:{
        type:Date,
        default:Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    retweets:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('tweets',tweetsSchema);