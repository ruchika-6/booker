import express, { json } from "express";
import mongoose from "mongoose";
import AuthRoute from "./routes/auth.js";
import HotelsRoute from "./routes/hotels.js";
import RoomsRoute from "./routes/rooms.js";
import UserRoute from "./routes/users.js";
import SubscriberRoute from "./routes/subscriber.js";
import RazorPay from "./routes/razorpay.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path"

dotenv.config();

const app = express();
async function connect(){
    try{
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb connected...");
    }catch(error)
    {
        throw error;
    }
}; 

mongoose.connection.on("disconnected", ()=>{
    console.log("mongoDb disconnected")
})

mongoose.connection.on("connected", ()=>{
    console.log("mongoDb connected")
})

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", AuthRoute);
app.use("/api/hotels", HotelsRoute);
app.use("/api/users", UserRoute);
app.use("/api/rooms", RoomsRoute);
app.use("/api/subscribe", SubscriberRoute);
app.use("/api/razorpay", RazorPay);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "/front/build")));

app.get("*", (req, res) =>
res.sendFile(path.resolve(__dirname1, "front", "build", "index.html"))
);

// --------------------------deployment------------------------------

//ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
    const errStatus = err.status || 500
    const errMessage = err.message || "Something Went Wrong!"
    return res.status(errStatus).json(errMessage);
})

app.listen(8000,()=>{
    connect();
    console.log("Connected to Backend...");
})