const { Router } = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const Singer = require("../models/singer");

const router = Router();

const upload = multer({
  storage: cloudinary.storage,
});

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const photo = {
      url: req.file.path,
      filename: req.file.filename,
    };

    const singer = new Singer({
      ...req.body,
      photo,
    });

    await singer.save();

    res.status(201).send("Singer created");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
