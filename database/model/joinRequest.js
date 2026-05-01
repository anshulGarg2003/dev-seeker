const mongoose = require("mongoose");

const JoinRequestSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewRoom",
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
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

JoinRequestSchema.index({ roomId: 1, userId: 1 }, { unique: true });
JoinRequestSchema.index({ roomId: 1, status: 1 });

const JoinRequest =
  mongoose.models.JoinRequest ||
  mongoose.model("JoinRequest", JoinRequestSchema);

module.exports = JoinRequest;
