const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;
