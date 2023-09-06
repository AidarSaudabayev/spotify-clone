const {Router} = require("express");
const Song = require("../models/song");
const router = Router();

// create song 
router.post('/', async  (req,res)=> {
    try {
const song= new Song(req.body)
await song.save();
res.status(201).send("Song created")


    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }
})

// get all songs

router.get("/",async (req,res) => {
try {
    const songs =await Song.find();
   if (!songs.length) {
    return res.send({message: "No songs found "})
   }

   res.status(201).send({songs});
} catch (error) {
 console.log(error);   
 res.status(500).json({error:error.message});
}

})

// get song by id 

router.get("/:id",async (req,res) => {
    try {
        const song =await Song.findById(req.params.id);
       if (!song) {
        return res.send({message: "song not found "})
       }
    
       res.status(201).send({song});
    } catch (error) {
     console.log(error);   
     res.status(500).json({error:error.message});
    }
    
    })

    // Delete  

    
router.delete("/:id",async (req,res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.send({message: "song not found "})
           }
           await Song.deleteOne({_id: req.params.id})
       res.status(201).json("Song is deleted");
    } catch (error) {
     console.log(error);   
     res.status(500).json({error:error.message});
    }
    
    })
    


module.exports = router;