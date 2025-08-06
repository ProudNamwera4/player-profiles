const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDatabase().db();
    const clubs = await db.collection("clubs").find().toArray();
    return res.status(200).json(clubs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json("Must use a valid club id.");
  }

  try {
    const db = mongodb.getDatabase().db();
    const club = await db
      .collection("clubs")
      .findOne({ _id: new ObjectId(id) });

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    return res.status(400).json(club);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createClub = async (req, res) => {
  const club = {
    name: req.body.name,
    gamesPlayed: req.body.gamesPlayed,
    wins: req.body.wins,
    draws: req.body.draws,
    losses: req.body.losses,
  };

  try {
    const db = mongodb.getDatabase().db();
    const response = await db.collection("clubs").insertOne(club);

    if (response.acknowledged) {
      return res.status(201).json({ id: response.insertedId, ...club });
    } else {
      return res.status(500).json({ error: "Failed to create player." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

const updateClub = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .json("Must use a valid player id to update a profile.");
  }

  const club = {
    name: req.body.name,
    gamesPlayed: req.body.gamesPlayed,
    wins: req.body.wins,
    draws: req.body.draws,
    losses: req.body.losses,
  };

  try {
    const db = mongodb.getDatabase().db();
    const response = await db
      .collection("clubs")
      .replaceOne({ _id: new ObjectId(id) }, club);

    if (response.modifiedCount > 0) {
      return res.status(204).send();
    } else {
      return res
        .status(404)
        .json({ message: "Club not found or no changes made." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

const deleteClub = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .json("Must use a valid player id to delete a profile.");
  }

  try {
    const db = mongodb.getDatabase().db();
    const response = await db
      .collection("clubs")
      .deleteOne({ _id: new ObjectId(id) });

    if (response.deletedCount > 0) {
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: "Club not found." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

module.exports = {
  getAll,
  getSingle,
  createClub,
  updateClub,
  deleteClub,
};
