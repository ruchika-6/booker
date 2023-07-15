import express from "express";
import Razorpay from "razorpay"
import { verifyToken} from "../utils/verifyToken.js";
import shortid from "shortid"
import crypto from "crypto"
import 'dotenv/config'

const router = express.Router();

const razorpay = new Razorpay({
	key_id: "rzp_test_mMCa9RkEASNIRF",
	key_secret: process.env.KEY_SECRET
})

router.post("/:price",async (req,res)=>{
    const payment_capture = 1;
    const amount = req.params.price;
    const currency = "INR";

    const options = {
        amount: amount*100,
        currency: currency,
        receipt:shortid.generate(),
        payment_capture
    }
    try {
        const response = await razorpay.orders.create(options)
        res.send(200).json(response);
    } catch (error) {
        console.log(error);
    }
});

export default router;