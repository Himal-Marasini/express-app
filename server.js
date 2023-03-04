const express = require("express");
const app = express();
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: ".env" });

const User = require("./models/users.model");
const isAuth = require("./isAuth");

const db = require("./db");

app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.get("/", (req, res, next) => {
  return res.json({
    success: true,
    message: "API is working"
  });
});

app.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, password, accountType } = req.body;
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      password,
      account_type: accountType
    });

    return res.json({
      success: true,
      message: "user has been registered. please login",
      data: user
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err
    });
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const { email_id, password } = req.body;

    const user = await User.findOne({ email: email_id.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Wrong email !! Please create the account at first."
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Wrong email or password."
      });
    }

    const access_token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_ACCESS_PRIVATE_KEY,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
      }
    );

    const refresh_token = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_PRIVATE_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    });

    return res.json({
      success: true,
      message: "Successfully Login.",
      access_token: access_token,
      refresh_token: refresh_token
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err
    });
  }
});

app.post("/home", isAuth, async (req, res, next) => {
  try {
    return res.json({
      success: true,
      data: req.user,
      message: "User is logged in !!"
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err
    });
  }
});

app.post("/refresh-token", async (req, res, next) => {});

db.then(() => {
  app.listen(8080, () => {
    console.log("App is running at 8080 !!");
  });
});
