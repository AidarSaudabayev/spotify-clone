const mongoose = require('mongoose')

const SingerSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
           },
        name:{
            type : String,
            required:true
        },
        country:{
            type : String,
            required:true,
        },
        photo:{
            url : String,
            filename: String,    
        },
        album:[{ 
            type : mongoose.Schema.Types.ObjectId,
            ref:"Album",
            required:true
        }],
    },
     {
        timestamps: true,
    }
);

module.exports = mongoose.model("Singer",SingerSchema);