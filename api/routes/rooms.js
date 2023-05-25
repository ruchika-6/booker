import express from "express";
import Room from "../models/room.js"
import Hotel from "../models/hotel.js"
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/:hotelid", verifyAdmin, async (req,res)=>{

    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);

    try{
        const savedRoom = await newRoom.save();
        try{
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: {rooms: savedRoom._id}
            });
            res.status(200).json(savedRoom);
        }catch{
            res.status(500).json(err);
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyAdmin, async (req,res)=>{
    try{
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});//new: true will make it return updated object, else it will return prev object
        res.status(200).json(updatedRoom);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//UPDATE AVAILABLE ROOMS
router.put("/availability/:id", async (req,res)=>{
    try{
        await Room.updateOne(
            {"roomNumbers._id":req.params.id},
            {
                $push:{
                    //syntax for nested properties
                    "roomNumbers.$.unavailableDates": req.body.dates
                }
            }
        )
        res.status(200).json("Room status has been updated");
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//DELETE
router.delete("/:id/:hotelid", verifyAdmin, async (req,res)=>{
    const hotelId = req.params.hotelid;
    try{
        await Room.findByIdAndDelete(req.params.id);
        try{
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: {rooms: req.params.id}
            });
            res.status(200).json("Room deleted");
        }catch{
            res.status(500).json(err);
        }
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//GET
router.get("/:id",async (req,res)=>{
    try{
        const room = await Room.findById(req.params.id);
        res.status(200).json(room);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//GET ALL
router.get("/",async (req,res)=>{
    try{
        const rooms = await Room.find(req.params.id);
        res.status(200).json(rooms);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
})

export default router;