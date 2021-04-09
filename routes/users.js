var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var passportLocalMangoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/swst", { useUnifiedTopology: true , useNewUrlParser: true });

var userSchema = mongoose.Schema({
  username: String,
  contact: Number,
  email: String,
  password: String,
  tweets : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'tweets'
  }]
});

userSchema.plugin(passportLocalMangoose);
module.exports = mongoose.model("user", userSchema);
