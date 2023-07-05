const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, process.env.JWTKEY);
    const user = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (user) {
      req.token = token;
      req.user = user;
      next();
    } else {
      throw new Error("Unable to find user");
    }
  } catch (error) {
    res.status(401).send("Unauthorized user");
    console.log(error);
  }
};
module.exports = verifyUser;
