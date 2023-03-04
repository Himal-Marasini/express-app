const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      require: true
    },
    last_name: {
      type: String,
      require: true
    },
    email_id: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    },
    account_type: {
      type: String,
      enum: ["web_users", "moderators", "admin"],
      require: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", schema);
