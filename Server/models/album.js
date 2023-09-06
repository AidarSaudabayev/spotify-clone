const mongoose = require('mongoose')

const AlbumSchema = new mongoose.Schema(
    {
        name:{
            type : String,
            required: true,
        },
        
        photo:{
            url : String,
            filename: String,    
        },
        songs:[{ 
            type : mongoose.Schema.Types.ObjectId,
            ref:"Song",
        }],
    },
     {
        timestamps: true,
    }
);

module.exports = mongoose.model("Album",AlbumSchema);