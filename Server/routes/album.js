const { Router } = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const Album = require("../models/album");
const router = Router();
const upload = multer({
  storage: cloudinary.storage,
});

// create album
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const photo = {
      url: req.file.path,
      filename: req.file.filename,
    };
    const album = new Album({
      ...req.body,
      photo,
    });
    await album.save();
    res.status(201).send("Album created");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// get all albums
router.get("/", async (_, res) => {
  try {
    const albums = await Album.find().populate("songs");
    if (!albums.length) {
      return res.send({ message: "No albums found" });
    }
    res.status(200).send({ albums });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get album by id
router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate("songs");
    if (!album) {
      return res.status(404).send({ message: "Album does not exist" });
    }
    res.status(200).send(album);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// delete an album
router.delete("/:id", async (req, res) => {
  try {
    const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
    if (!deletedAlbum) {
      return res.status(404).send({ message: "Album does not exist" });
    }
    res.status(200).send({ message: "Album deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


// add songs to an album

router.put("/:albumId/addSong", async (req, res) => {
  const { albumId } = req.params;
  console.log(albumId);
  const { songId } = req.body;
  const foundAlbum = await Album.findById(albumId);
  if (!foundAlbum) {
    return res.status(404).send({ message: "Album not found" });
  }
  foundAlbum.songs.push(songId);
  await foundAlbum.save();
  res.status(200).json({ message: "Song added to album" });
});

// delete song from album
router.put("/:albumId/deleteSong", async (req, res) => {
  const { albumId } = req.params;
  console.log(albumId);
  const { songId } = req.body;
  const foundAlbum = await Album.findById(albumId);
  if (!foundAlbum) {
    return res.status(404).send({ message: "Album not found" });
  }
  foundAlbum.songs.pull(songId);
  await foundAlbum.save();
  res.status(200).json({ message: "Song delete from album" });
});






module.exports = router;