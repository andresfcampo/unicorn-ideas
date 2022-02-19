const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const Post = require("../models/post.model");

const router = express.Router();

// shows post creation form
router.get("/create", isLoggedIn, (req, res) => {
  res.render("post/create");
});

// handles the creation of a post
router.post("/create", isLoggedIn, async (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.description = req.body.description;
  post.private = req.body.private;
  post.author = req.session.currentUser._id;
  try {
    await post.save();
    res.redirect("/");
  } catch (error) {
    res.redirect("/post/create");
  }
});

// shows all posts
router.get("/viewAll", isLoggedIn, async (req, res) => {
  const posts = await Post.find({ author: req.session.currentUser._id });
  res.render("post/viewAll", { posts });
});

// show private post
router.get("/viewPrivate", isLoggedIn, async (req, res) => {
  const posts = await Post.find({
    author: req.session.currentUser._id,
    private: true,
  });
  res.render("post/viewAll", { posts });
});

// shows public posts
router.get("/viewPublic", isLoggedIn, async (req, res) => {
  const posts = await Post.find({ private: false });
  res.render("post/viewAll", { posts });
});

// show one post
router.get("/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("comments")
    .populate("author")
    .populate({
      path: "comments",
      populate: "author",
    });
  console.log(post);
  res.render("post/viewOne", { post });
});

// the upvote route
router.get("/upvote/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.upvote.includes(req.session.currentUser._id)) {
    post.upvote.push(req.session.currentUser._id);
    post.save();
  }
  res.redirect("/post/viewPublic");
});

// the downvote route
router.get("/downvote/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.downvote.includes(req.session.currentUser._id)) {
    post.downvote.push(req.session.currentUser._id);
    post.save();
  }
  res.redirect("/post/viewPublic");
});

module.exports = router;