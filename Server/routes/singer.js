const {Router} = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const Singer = require("../models/singer");
const singer = require("../models/singer");

const router = Router();

const upload = multer({
    storage:cloudinary.storage,
});


router.post('/',upload.single("photo"), async  (req,res)=> {
    try {
const photo = {
    url:req.file.path,
    filename:req.file.filename
}
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

router.get("/",async (req,res) => {
try {
    const singers =await Singer.find();
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

router.get("/:id",async (req,res) => {
    try {
        const singer =await Singer.findById(req.params.id);
       if (!Singer) {
        return res.send({message: "singer not found "})
       }
    
       res.status(200).send({singer});
    } catch (error) {
     console.log(error);   
     res.status(500).json({error:error.message});
    }
    
    })

    // Delete  

    
router.delete("/:id",async (req,res) => {
    try {
        const singer =await Singer.findById(req.params.id);
        if (!singer) {
            return res.send({message: "singer not found "})
           }
           await Singer.deleteOne({_id: req.params.id})
       res.status(200).send("Singer deleted");
    } catch (error) {
     console.log(error);   
     res.status(500).json({error:error.message});
    }
    
    })
    

router.put("/:singerId/addAlbum", async (req, res) => {
  const { singerId } = req.params;
  const { albumId } = req.body;

  const foundSinger = await Singer.findById(singerId);
  if (!singerId) {
    return res.status(404).send({ message: "Singer not found" });
  }
  foundSinger.album.push(albumId);

  await foundSinger.save();
  
  res.status(200).json({ message: "Album added to Singer" });
});

module.exports = router;