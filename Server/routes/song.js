const { Router } = require("express");
const Song = require("../models/song");
const { authentificateJWT } = require("./helper");
const router = Router();

// create song
router.post("/", authentificateJWT, async (req, res) => {
  try {
    const songData = req.body;
    songData.author = req.user.userId;
    const song = new Song(req.body);
    await song.save();
    res.status(201).send("Song created");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
// get all songs
router.get("/", authentificateJWT, async (req, res) => {
  try {
    const songs = await Song.find({ author: req.user.userId });
    if (!songs.length) {
      return res.send({ message: "No songs found" });
    }
    res.status(200).send({ songs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
// get song by id
router.get("/:id", authentificateJWT, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).send({ message: "Song does not exist" });
    }
    if (song.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .send({ message: "You are not authorized to view this song" });
    }
    res.status(200).send(song);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
// delete a song
router.delete("/:id", authentificateJWT, async (req, res) => {
  try {
    const song = await Song.findById({ _id: req.params.id });
    if (!song) {
      return res.status(404).send({ message: "Song does not exist" });
    }
    if (song?.author?.toString() !== req.user.userId) {
      return res
        .status(403)
        .send({ message: "You are not authorized to delete this song" });
    }
    await Song.deleteOne({ _id: song._id });
    res.status(200).send({ message: "Song deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;