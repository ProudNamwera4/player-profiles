//players.js
const express = require("express");
const router = express.Router();
const validation = require("../middleware/validate");
const { isAuthenticated } = require("../middleware/authenticate");

const clubsController = require("../controllers/clubs");

router.get("/", clubsController.getAll);

router.get("/:id", clubsController.getSingle);

router.post(
  "/",
  isAuthenticated,
  validation.saveClub,
  clubsController.createClub
);

router.put(
  "/:id",
  isAuthenticated,
  validation.saveClub,
  clubsController.updateClub
);

router.delete("/:id", isAuthenticated, clubsController.deleteClub);

module.exports = router;
