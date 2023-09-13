const mongoose = require('mongoose')

const SongSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
           },
        title:{
            type : String,
            required:true
        },
        duration:{
            type:Number,
            required:true
        },
    },
     {
        timestamps: true,
    }
);

module.exports =  mongoose.model("Song",SongSchema);