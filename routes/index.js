const express = require("express");
const router = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local");

const userModel = require("./users");
const tweetModel = require("./tweets");

passport.use(new localStrategy(userModel.authenticate()));


router.get("/like/:tweetId", isLoggedIn, function (res, req) {
  console.log(req.session);
});

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

router.get("/temp", isLoggedIn,function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user })
    .populate("tweets")
    .then(function (foundUser) {
      res.send(foundUser);
    });
});

router.get("/show-tweet", function (req, res) {
  tweetModel.find().then(function (tweets) {
    res.send(tweets);
  });
});

// router.get('/likes/:tweetid',function(req,res){
//   userModel.findOne({username : req.session.passport.user})
//   console.log(req.session.passport.user)
//     .then(foundUser=>{
//       tweetModel.findOne({_id : req.params.tweetid})
//       .then(foundTweet =>{
//           console.log(foundTweet)
//           foundTweet.likes.push(foundUser._id)
//           foundTweet.save()
//             .then(data => {
//               res.send(data)
//             })
//         })
//     })
//     .catch(err => res.send(err))
// })

router.get('/likes/:tweetid',function(req,res){
  userModel.findOne({username : req.session.passport.user})
    .then(foundUser=>{
      tweetModel.findOne({_id : req.params.tweetid})
      console.log(req.params.tweetid)
        .then(foundTweet =>{
          foundTweet.likes.push(foundUser._id)
          foundTweet.save()
            .then(data => {
              res.send(data)
            })
        })
    })
    .catch(err => res.send(err))
  
})

router.get('edit/:tweetid',isLoggedIn, function(req, res, next){
  userModel.findOne({username: req.session.passport.user})
  .then(function(foundUser) {
    tweetModel.findById(req.params.tweetid)
    .then(function(foundTweet){
      if (foundTweet.userId === foundUser._id){
        res.send('show update page');
      }
      else{
        res.send('not your tweet');
      }
    })
  })
})
router.post('/edit/:tweetid',isLoggedIn, function (req, res,next){
  tweetModel.findOneAndUpdate({_id: req.params.tweetid})
  .then(function(foundTweet){
    caption: req.body.caption
  })
  console.log("update");
})






function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

module.exports = router;
