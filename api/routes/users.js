import express from "express";
import User from "../models/user.js"
import { verifyToken, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauth", verifyToken,(req,res,next)=>{
//     res.send("You are logged in");
// })

// router.get("/checkadmin", verifyAdmin,(req,res,next)=>{
//     res.send("You are logged in and You can delete all accounts");
// })
//CREATE
router.post("/",async (req,res)=>{

    const newUser = new User(req.body)

    try{
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//UPDATE
router.put("/:id",verifyToken, async (req,res)=>{
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});//new: true will make it return updated object, else it will return prev object
        res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//UPDATE
router.put("/bookings/:id",verifyToken, async (req,res)=>{
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$push: {"bookings":req.body.bookings}}, {new: true});
        res.status(200).send(updatedUser);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//DELETE
router.delete("/:id", verifyToken, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted");
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//GET
router.get("/:id", verifyToken, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//GET ALL
router.get("/",verifyAdmin, async (req,res)=>{
    try{
        const users = await User.find(req.params.id);
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
})

export default router;