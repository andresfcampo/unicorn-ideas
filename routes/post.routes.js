const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const Post = require("../models/post.model");

const router = express.Router();

// shows post creation form
router.get("/create", isLoggedIn, (req, res) => {
  res.render("post/create");
});

// post creation
router.post("/create", isLoggedIn, async (req, res) => {
  const post = new Post();
  post.idea = req.body.idea;
  post.description = req.body.description;
  post.industry = req.body.industry;
  post.private = req.body.private;
  post.author = req.session.currentUser._id;
  try {
    await post.save();
    res.redirect("/post/viewAll");
  } catch (error) {
    res.redirect("/post/create");
  }
});

// form for updating an existing post
router.get('/update/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)
  res.render('post/updatePost', { post })
})

// route for handling the update of an existing post
router.put(
  '/updatePost/:id',
  async (req, res) => {
    const post = await Post.findById(req.params.id)
    post.idea = req.body.idea
    post.description = req.body.description
    post.industry = req.body.industry
    await post.save() 
    res.redirect("/post/viewAll")
  },
)



// route for handling the deletion of a post
router.delete('/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id)
  res.redirect('/post/viewAll')
})

// shows all posts
router.get("/viewAll", isLoggedIn, async (req, res) => {
  const posts = await Post.find().populate("author");
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
  res.redirect("/post/viewAll");
});

// the downvote route
router.get("/downvote/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.downvote.includes(req.session.currentUser._id)) {
    post.downvote.push(req.session.currentUser._id);
    post.save();
  }
  res.redirect("/post/viewAll");
});

module.exports = router;