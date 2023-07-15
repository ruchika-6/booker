import mongoose from "mongoose";

const otpVerifySchema = new mongoose.Schema(
    {
        userId:{
            type: String,
            required: true,
        },
        otp:{
            type: String,
        },
        createdAt:{
            type: Date,
        },
        expiresAt:{
            type: Date,
        },
    }
);

const otpVerify = mongoose.model("otpVerify", otpVerifySchema);
export default otpVerify;