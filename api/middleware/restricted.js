const Users = require("../users-model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets");
/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

const restrict = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return next({ status: 401, message: 'token required' })
  } 
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'token invalid' })
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
};

const checkReqBody = (req, res, next) => {
  const { username, password } = req.body;
  if (
    !username ||
    username.trim() === "" ||
    typeof username !== "string" ||
    !password
  ) {
    return next({ status: 400, message: "username and password required" });
  }
  next();
};

const checkUsernameFree = async (req, res, next) => {
  try {
    const { username } = req.body;
    const existing = await Users.findBy({ username }).first();
    if (existing) {
      res.status(422).json({ status: 422, message: "username taken" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const checkUsernameExist = async (req, res, next) => {
  try {
    const { username } = req.body;
    const existing = await Users.findBy({ username }).first();
    if (!existing) {
      res.status(401).json({ message: "invalid credentials" });
    } else {
      req.user = existing;
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  restrict,
  checkReqBody,
  checkUsernameFree,
  checkUsernameExist,
};
