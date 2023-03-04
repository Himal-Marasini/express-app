const jwt = require("jsonwebtoken");
const User = require("./models/users.model");

module.exports = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (typeof token !== "undefined") {
    const bearer = token.split(" ");
    token = bearer[1];

    const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY, function (err, decoded) {
      if (err) return false;
      if (!decoded) return false;
      return decoded;
    });

    if (!decode) {
      return res.status(401).json({ success: false, message: "Login Expires !! Please login." });
    }

    const user = await User.findById(decode.id);

    if (!user) {
      return res.status(400).json({ success: false, message: "User doesn't exists." });
    }

    req.user = user;
    next();
  } else {
    return next(new AppError("Not authorized.", 401));
  }
};
