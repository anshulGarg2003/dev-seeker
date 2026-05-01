const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friendname: {
      type: String,
      required: true,
    },
    friendimage: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: true,
    },
    sendBy: {
      type: String,
      required: true,
    },
    data: {
      type: String,
    },
    usefulId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const NewUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    github: {
      type: String,
    },
    friends: [friendSchema],
    friendsRequests: [friendSchema],
    friendsRequestSend: [friendSchema],
    notification: [notificationSchema],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewUser",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewUser",
      },
    ],
    badges: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
    },
    country: {
      type: String,
    },
    role: {
      type: String,
    },
    institute: {
      type: String,
    },
    tags: {
      type: String,
    },
    rating: {
      type: Number,
      default: 5,
    },
    totaltime: {
      type: Number,
      default: 0,
    },
    totalcoins: {
      type: Number,
      default: 100,
    },
    transaction: [
      {
        status: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
        remaincoins: {
          type: Number,
          required: true,
        },
      },
    ],
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewRoom", // Ensure this references the NewRoom model
      },
    ],
    activity: [
      {
        date: {
          type: String, // "YYYY-MM-DD"
          required: true,
        },
        count: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const NewUser =
  mongoose.models.NewUser || mongoose.model("NewUser", NewUserSchema);

module.exports = NewUser;
