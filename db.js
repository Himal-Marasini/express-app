const mongoose = require("mongoose");

module.exports = mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => console.error(`ERROR !!! Can't Connect to MongoDB ${err}`));
