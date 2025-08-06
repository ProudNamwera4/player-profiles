const validator = require("../helpers/validate");

const savePlayer = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    position: "required|string",
    team: "required|string",
    age: "required|integer",
    appearance: "required|integer",
    goals: "required|integer",
    assists: "required|integer",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const saveClub = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    gamesPlayed: "required|integer",
    wins: "required|integer",
    draws: "required|integer",
    losses: "required|integer",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = {
  savePlayer,
  saveClub,
};
