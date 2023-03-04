const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    token: {
      type: String,
      require: true,
      unique: true
    },
    blacklisted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("RefreshToken", schema);
