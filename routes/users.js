const router=require("express").Router();
const User=require("../models/User.js");
const Post=require("../models/Post.js");
const bcrypt=require('bcryptjs');

//UPDATE
router.put("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id){
        if(req.body.password){
            const salt=await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(req.body.password,salt);
        }
        try{
          const updateUser=await User.findByIdAndUpdate(req.params.id,{
             $set:req.body,
          },{new:true});
          res.status(200).json(updateUser);
        }catch(err){
           res.status(500).json(err.message);
        }
    }else{
        res.status(401).json("You can update only your account");
    }
})

//GET
router.get("/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        const {password,...others}=user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err.message);
    }
})


//DELETE
router.delete("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id){
        try{
            const user=await User.findById(req.params.id);
            try{
                //Deleting the posts of User before deleting it
               await Post.deleteMany({username:user.username});

               await User.findByIdAndDelete(req.params.id);
               res.status(200).json("User deleted...");
            }catch(err){
               res.status(500).json(err.message);
            }
        }catch(err){
            res.status(404).json("User not found");
        }
    }else{
        res.status(401).json("You can delete only your account");
    }
})

module.exports=router;