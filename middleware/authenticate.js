//middleware/authenticate.js
const isAuthenticated = (req, res, next) => {
  if (typeof req.isAuthenticated !== "function" || !req.isAuthenticated()) {
    return res.status(401).json("You do not have access!");
  }
  next();
};

module.exports = {
  isAuthenticated,
};
