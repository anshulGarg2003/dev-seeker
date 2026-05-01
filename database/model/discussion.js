const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

const DiscussionSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    replies: {
      type: [ReplySchema],
      default: [],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

// Compound index for efficient room-based queries sorted by newest
DiscussionSchema.index({ roomId: 1, createdAt: -1 });

const Discussion =
  mongoose.models.Discussion ||
  mongoose.model("Discussion", DiscussionSchema);

module.exports = Discussion;
