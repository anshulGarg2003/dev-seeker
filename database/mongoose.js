const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using cached connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new connection promise.");
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then((mongoose) => {
        console.log("New connection established.");
        return mongoose;
      })
      .catch((err) => {
        console.error("Mongoose connection error:", err);
        throw err;
      });
  } else {
    console.log("Awaiting existing connection promise.");
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    console.error("Error awaiting mongoose connection:", err);
    throw err;
  }
}

module.exports = connectToDatabase;
