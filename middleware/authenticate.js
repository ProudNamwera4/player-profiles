//middleware/authenticate.js
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // User authenticated, proceed
  }
  return res.status(401).json("You do not have access!"); // Otherwise block
};

module.exports = {
  isAuthenticated,
};
