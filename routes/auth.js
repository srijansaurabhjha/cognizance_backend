const router=require("express").Router();
const User=require("../models/User.js");
const bcrypt=require('bcryptjs');

//REGISTER
router.post("/register",async(req,res)=>{
    try{
       
       const salt=await bcrypt.genSalt(10);
       const hashedPass=await bcrypt.hash(req.body.password,salt);

       const newUser=new User({
           username:req.body.username,
           email:req.body.email,
           password:hashedPass,
           profilePic:req.body.profilePic,
       });

       const user = await newUser.save();
       res.status(200).json(user);
    }catch(err){
       res.status(500).json(err.message);
    }
})

//LOGIN
router.post("/login",async(req,res)=>{
    try{
        const user=await User.findOne({username:req.body.username});
        if(!user){
            res.status(400).json("Wrong Credentials!");
        }else{
            const validate=await bcrypt.compare(req.body.password,user.password);
            if(!validate){
                res.status(400).json("Wrong Credentials!");
            }else{
                const {password,...others}=user._doc;
                res.status(200).json(others);
            } 
        }

    }catch(err){
        res.status(500).json(err.message);
    }
})

module.exports=router;