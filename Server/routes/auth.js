const router = require("express").Router();
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await savedUser.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const userExists = await UserModel.findOne({email})
        if (!userExists) {
            return res.status(400).json({message: "User does not exist"})
        }
        const isMatch = await bcrypt.compare(password, userExists.password)

        if(!isMatch) {
            res.status(400).json({message:"Password is not valid"})
        }

   const token =jwt.sign({userId:userExists._id}, "test",{
    expiresIn:"1h"
   })

   res
   .cookie("access_token", token,{httpOnly:true})
   .status(200)
   .json({
    token, 
    user: {
        ...userExists._doc,
        password:null,
    },
   })

    } catch (error) {
        console.log(error)
    }
})
module.exports = router;