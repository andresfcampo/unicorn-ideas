const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { isLoggedIn } = require("../middlewares/guard");

const router = express.Router();

// shows the sign-up form
router.get("/signup", (req, res) => {
  res.render("user/signup");
});

// handles the creation of a user
router.post("/signup", async (req, res) => {
  const user = new User();
  user.email = req.body.email;
  user.user = req.body.user;
  console.log (req.body)
  try {
    user.password = await bcrypt.hash(req.body.password, 10);
    console.log (user)
    await user.save();
    res.redirect("/user/login");
  } catch (error) {
    res.redirect("/user/signup");
  }
});


// shows the log in form
router.get("/login", (req, res) => {
  res.render("user/login");
});

// handles the authentication of a user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ user: req.body.user });
    const isPwCorrect = await bcrypt.compare(req.body.password, user.password);
    if (isPwCorrect) {
      req.session.currentUser = user;
      res.redirect("/user/profile");
    } else {
      res.redirect("/user/login");
    }
  } catch (error) {
    res.redirect("/user/login");
  }
});

// route for loggin out
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/user/login");
});

// shows a user's profile page
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("user/profile");
});

module.exports = router;