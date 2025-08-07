const router = require("express").Router();
const passport = require("passport");

router.use("/", require("./swagger"));
router.use("/players", require("./players"));
router.use("/clubs", require("./clubs"));

router.get("/login", passport.authenticate("github"), (req, res) => {});

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/api-docs" }),
  (req, res) => {
    res.redirect("/api-docs"); // Redirect to Swagger UI after login
  }
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
