const mongoose = require("mongoose");

const NewRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      default: "Programming",
    },
    githubrepo: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    estimatedTime: {
      type: String,
      enum: ["quick", "30min", "1hour", "2hours+"],
      default: "30min",
    },
    category: {
      type: String,
      enum: ["bug-fix", "feature-help", "code-review", "architecture", "learning"],
      default: "bug-fix",
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    isLive: {
      type: Boolean,
      required: true,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userProfile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const NewRoom =
  mongoose.models.NewRoom || mongoose.model("NewRoom", NewRoomSchema);

module.exports = NewRoom;
