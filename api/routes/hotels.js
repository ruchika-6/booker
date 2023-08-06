import express from "express";
import Hotel from "../models/hotel.js"
import Room from "../models/room.js"
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/",verifyAdmin, async (req,res)=>{

    const newHotel = new Hotel(req.body)

    try{
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//UPDATE
router.put("/:id", verifyAdmin, async (req,res)=>{
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});//new: true will make it return updated object, else it will return prev object
        res.status(200).json(updatedHotel);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//DELETE
router.delete("/:id", verifyAdmin, async (req,res)=>{
    try{
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel deleted");
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//GET
router.get("/find/:id",async (req,res)=>{
    try{
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
});

//GET ALL
router.get("/",async (req,res)=>{
    const {min,max, ...others} = req.query
    try{
        const hotels = await Hotel.find({...others, cheapestPrice: {$gt: min || 1, $lt:max || 999}});
        res.status(200).json(hotels);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
})

router.get("/countByCity",async (req,res)=>{
    const cities = req.query.cities.split(",")
    try{
        const list = await Promise.all(cities.map(city=>{
            return Hotel.countDocuments({city:city})
        }))
        res.status(200).json(list);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
})

router.get("/countByType",async (req,res)=>{
    const types  = req.query.types.split(",")
    try{
        const list = await Promise.all(types.map(type=>{
            return Hotel.countDocuments({type:type})
        }))
        res.status(200).json(list);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
})

router.get("/room/:id",async (req,res)=>{
    try{
        const hotel = await Hotel.findById(req.params.id);
        const list = await Promise.all(hotel.rooms.map(room=>{
            return Room.findById(room)
        }))
        res.status(200).json(list);
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
})

export default router;