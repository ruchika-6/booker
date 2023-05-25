import express from "express";
import Razorpay from "razorpay"
import { verifyToken} from "../utils/verifyToken.js";

const router = express.Router();

const razorpay = new Razorpay({
	key_id: 'rzp_test_mMCa9RkEASNIRF',
	key_secret: 'X6NqKyF7Jxw9YXhFOetVLvKN'
})

router.post("/:price",async (req,res)=>{
    const payment_capture = 1;
    const amount = 500;
    const currency = "INR";

    const options = {
        amount: amount*100,
        currency: currency,
        receipt:"soo17317jfpow",
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