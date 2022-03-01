const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  idea: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // this is a reference to the user model
  author: {
    // type object id
    type: mongoose.SchemaTypes.ObjectId,
    // reference to user model
    ref: "User",
    required: true,
  },
  comments: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
    ref: "Comment",
  },
  upvote: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
    ref: "User",
  },
  downvote: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
    ref: "User",
  },
});


module.exports = mongoose.model("Post", postSchema);