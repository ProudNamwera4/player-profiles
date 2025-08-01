const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDatabase().db();
    const players = await db.collection("players").find().toArray();
    return res.status(200).json(players);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .json("Must use a valid player id to find a profile.");
  }

  try {
    const db = mongodb.getDatabase().db();
    const player = await db
      .collection("players")
      .findOne({ _id: new ObjectId(id) });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    return res.status(200).json(player);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createPlayer = async (req, res) => {
  const player = {
    name: req.body.name,
    position: req.body.position,
    team: req.body.team,
    age: req.body.age,
    appearance: req.body.appearance,
    goals: req.body.goals,
    assists: req.body.assists,
  };

  try {
    const db = mongodb.getDatabase().db();
    const response = await db.collection("players").insertOne(player);

    if (response.acknowledged) {
      return res.status(201).json({ id: response.insertedId, ...player });
    } else {
      return res.status(500).json({ error: "Failed to create player." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

const updatePlayer = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .json("Must use a valid player id to update a profile.");
  }

  const player = {
    name: req.body.name,
    position: req.body.position,
    team: req.body.team,
    age: req.body.age,
    appearance: req.body.appearance,
    goals: req.body.goals,
    assists: req.body.assists,
  };

  try {
    const db = mongodb.getDatabase().db();
    const response = await db
      .collection("players")
      .replaceOne({ _id: new ObjectId(id) }, player);

    if (response.modifiedCount > 0) {
      return res.status(204).send();
    } else {
      return res
        .status(404)
        .json({ message: "Player not found or no changes made." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

const deletePlayer = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .json("Must use a valid player id to delete a profile.");
  }

  try {
    const db = mongodb.getDatabase().db();
    const response = await db
      .collection("players")
      .deleteOne({ _id: new ObjectId(id) });

    if (response.deletedCount > 0) {
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: "Player not found." });
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
  createPlayer,
  updatePlayer,
  deletePlayer,
};
