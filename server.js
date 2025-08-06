require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;

const mongodb = require("./data/database");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:8080", "https://player-profiles.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());
app.set("json spaces", 2);
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.CALLBACK_URL ||
        "http://localhost:8080/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Protect all API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/players") || req.path.startsWith("/clubs")) {
    if (!req.isAuthenticated()) {
      return res.status(401).json("You do not have access!");
    }
  }
  next();
});

// Routes
app.use("/", routes);

// Start server
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});
