const express = require("express");
const router = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local");

const userModel = require("./users");

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post("/reg", function (req, res, next) {
  var newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
  });
  userModel
    .register(newUser, req.body.password)
    .then(function (user) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    })
    .catch(function (err) {
      res.send(err);
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/failed",
  }),
  (req, res, next) => {console.log("login Done")}
);

router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect("/");
});

router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile");
});


router.get("/failed", (req, res) => {
  res.send("you are the not valid user");
});

router.post("/posttweet", isLoggedIn, (req, res) => {
  console.log(req.session.passport)
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function (foundUser) {
      console.log(foundUser);
      tweetModel.create({
        caption: req.body.caption,
        userId: foundUser._id,
      });
      res.send("tweet done");
    });
});




function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

module.exports = router;
