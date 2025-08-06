// server.js
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

app.set("trust proxy", 1); // Needed for Render and other proxies

app.use(express.json());
app.set("json spaces", 2);

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // send cookie over HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site cookie for prod
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Proper CORS setup — adjust origin to your frontend domain
app.use(
  cors({
    origin:
      process.env.FRONTEND_ORIGIN || "https://player-profiles.onrender.com", // set frontend URL here for production
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// Remove your manual Access-Control-Allow-Origin headers

app.use("/", require("./routes/index.js"));

process.on("uncaughtException", (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `Logged in as ${req.user.username || req.user.displayName || "User"}`
    );
  } else {
    res.send("Logged Out");
  }
});

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
  }),
  (req, res) => {
    // Passport sets req.user in session automatically
    res.redirect("/");
  }
);

// Optional: add a test route to check authentication status
app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Start the server
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server listening on port ${process.env.PORT || 8080}`);
    });
  }
});
