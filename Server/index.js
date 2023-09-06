
const express = require("express");
const mongoose =require("mongoose");
const bodyParser = require("body-parser");
const singerRoutes = require("./routes/singer")
const cors = require("cors");
const songRoutes = require("./routes/song");
const albumRoutes = require("./routes/album");


const app =express();
const PORT =3001;

app.use(cors());
app.use(bodyParser.json());

const uri ="mongodb+srv://Aidar:Darkurs24326@cluster0.xakcqva.mongodb.net/spotify?retryWrites=true&w=majority";

app.use("/api/singer", singerRoutes);
app.use("/api/song", songRoutes)
app.use("/api/album", albumRoutes)

// app.use('/api/song')
// app.use('/api/singer',singerRoutes)
// app.use('/api/album')




function start () {
    try {
   mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
   });

   mongoose.connection.on("connected", ()=>{
console.log("Connected to MongoDB Atlas");
   })

   app.listen(PORT, ()=> console.log('Server has started')) ;       
    } catch (error) {
        console.log(error );
    }
}

start()