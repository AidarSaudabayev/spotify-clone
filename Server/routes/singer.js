const {Router} = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const Singer = require("../models/singer");
const { authentificateJWT } = require("./helper");
const album = require("../models/album");

const router = Router();

const upload = multer({
    storage:cloudinary.storage,
});

// create singer

router.post('/',authentificateJWT,upload.single("photo"),
 async  (req,res)=> {
    try {
const photo = {
    url:req.file.path,
    filename:req.file.filename
}

const singerData = req.body; 
singerData.author = req.user.user.userId;

        const singer= new Singer({
     ...req.body,
      photo
        })

await singer.save()
res.status(201).send("Singer created")
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }
})


// get all singers

router.get("/",authentificateJWT, async (req,res) => {
try {
    const singers =await Singer.find({author:req.user.userId}).populate(
        "album"
    );
   if (!singers.length) {
    return res.send({message: "No singers found "})
   }

   res.status(200).send({singers});
} catch (error) {
 console.log(error);   
 res.status(500).json({error:error.message});
}

})

// get singer by id 

router.get("/:id",authentificateJWT, async (req,res) => {
    try {
        const singer =await Singer.findById(req.params.id);
       if (!singer) {
        return res.status(404).send ({message: " Singer does not exist"});
       }
       if (singer.author.toString() !== req.user.userId ) {
        return res
        .status(404)
        .send({message: "You are not authorized to view this singer "});
       }
    
       res.status(200).send({singer});
    } catch (error) {
     console.log(error);   
     res.status(500).json({error:error.message});
    }
    })


    // Delete  a singer
    Nazim, [13.09.2023 13:59]
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
    
    Nazim, [13.09.2023 13:59]
    const jwt = require("jsonwebtoken");
    
    const authentificateJWT = (req, res, next) => {
      const token = req.cookies.access_token;
      if (token) {
        jwt.verify(token, "test", (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }
          req.user = user;
          next();
        });
      }
    };
    module.exports = {
      authentificateJWT,
    };
    
  
    // delete album from singer
    router.put("/:singerId/deleteAlbum", authentificateJWT, async (req, res) => {
      const { singerId } = req.params;
      const { albumId } = req.body;
      const foundSinger = await Singer.findById(singerId);
      if (!foundSinger) {
        return res.status(404).send({ message: "Singer not found" });
      }
      if (foundSinger.author.toString() !== req.user.userId) {
        return res
          .status(403)
          .send({ message: "You are not authorized to remove this album" });
      }
      foundSinger.album.pull(albumId);
      await foundSinger.save();
      res.status(200).json({ message: "Album removed from singer" });
    });
    
// add album to singer
router.put("/:singerId/addAlbum", async (req, res) => {
  const { singerId } = req.params;
  const { albumId } = req.body;

  const foundSinger = await Singer.findById(singerId);
  if (!foundSinger) {
    return res.status(404).send({ message: "Singer not found" });
  }
  if (foundSinger.author.toString() !==req.user.userId) {
    return res.status(403).send({ message: "You are not authorized to add this album" });
  }

if(foundSinger.album.includes(albumId)) {
    return res.status(400)
    .send({message:"Album is already added to the singer"});
}

  foundSinger.album.push(albumId);

  await foundSinger.save();
  
  res.status(200).json({ message: "Album added to Singer" });
});

module.exports = router;