const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  donations: [{ type: Schema.Types.ObjectId, ref: "Donation" }],
});

const Post = model("Post", postSchema);
module.exports = Post;
