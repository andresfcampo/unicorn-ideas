const express = require("express");
const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const router = express.Router();

router.post("/create/:id", async (req, res) => {
  // todo
  // 1- we need to fetch the post
  const post = await Post.findById(req.params.id);
  // 2- we need to get the user
  const user = req.session.currentUser;
  // 3- we need to create the comment
  const comment = new Comment();
  comment.content = req.body.content;
  comment.author = user._id;
  await comment.save();
  // 4- append the comment to the post
  post.comments.push(comment.id);
  await post.save()
  // 5- redirect to the same page
  res.redirect(`/post/${post.id}`);
});

module.exports = router;