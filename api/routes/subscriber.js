import express from "express";
import Subscriber from "../models/subscriber.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", async (req,res)=>{

    const newSubscriber = new Subscriber(req.body)

    try{
        const savedSubscriber = await newSubscriber.save();
        res.status(200).json(savedSubscriber);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//GET ALL
router.get("/",verifyAdmin, async (req,res)=>{
    try{
        const subscribers = await Subscriber.find({});
        res.status(200).json(subscribers);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
})

//DELETE
router.delete("/:id", verifyAdmin, async (req,res)=>{
    try{
        await Subscriber.findByIdAndDelete(req.params.id);
        res.status(200).json("Subscriber deleted");
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

export default router;