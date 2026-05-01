const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
      maxlength: 50000,
    },
    tags: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ userId: 1, createdAt: -1 });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
module.exports = Blog;
