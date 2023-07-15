import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "./mailTransporter.js"
import otpVerify from "../models/otpVerify.js"
import 'dotenv/config'

const sendOtpVerificationEmail = async ({_id,email},res)=>{
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    try
    {
        var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verify Your Email",
            html : `<p>Enter <b>${otp}</b> to verify your email and complete the registration.<p>
            <p>This code will <b>expire in 1 hour<b><p>`
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(otp,salt);

        const newOtpVerify = await new otpVerify({
            userId: _id,
            otp: hash,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000, //1hr from current
        });

        await newOtpVerify.save();

        transporter.sendMail(mailOptions);
        res.json({
            status:"PENDING",
            message: "Verification email sent",
            data:{
                userId:_id,
                email,
            }
        })
    }
    catch(err)
    {
        res.status(500).json("Enter valid email");
    }
}

//CREATE
export const register = async (req,res,next)=>{
    try{
        let user = await User.findOne({email: req.body.email})
        if(user)
        {
            if(user.verified)
                return res.status(500).json("User Already Exists")
            else
            {
                return res.json({
                    status:"PENDING",
                    message: "Verification email sent",
                    data:{
                        userId:user._id,
                        email: user.email,
                    }
                })
            }
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash,
            verified: false
        })
        const result = await newUser.save();
        sendOtpVerificationEmail(result,res);
    }
    catch(err){
        res.status(500).json(err.message);
        // next(err);
    }
}

//CREATE
export const login = async (req,res,next)=>{
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user)
            return res.status(404).send("User not found");

        if(!user.verified)
            return res.status(500).send("User not verified yet. Register again.");

        const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password);
        if(!isPasswordCorrect)
            return res.status(400).send("Incorrect username or password");
        
        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, "secret");
        const { password, isAdmin, ...others } = user._doc;
        res.cookie("access_token",token,{
            httpOnly: true,
        }).status(200).json({details:{...others},isAdmin}); 
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
}

export const googleUser = async (req,res,next) =>{
    try{
        let user = await User.findOne({email: req.body.email})
        if(!user)
        {
            const newUser = new User({
                ...req.body,
            })
            await newUser.save();
            user = await User.findOne({email: req.body.email});
        }
        
        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, "secret");
        const { isAdmin, ...others } = user._doc;
        res.cookie("access_token",token,{
            httpOnly: true,
        }).status(200).json({details:{...others},isAdmin}); 
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
}

export const resendOtp = async(req,res) =>{
    const { userId, email } = req.body;
    if(!userId || !email){
        return res.status(500).send("User not found. Register");
    }
    try
    {
        await otpVerify.deleteMany({ userId: userId});
        sendOtpVerificationEmail({_id:userId,email:email},res);
    }
    catch(err){
        res.status(500).json(err.message)
    }
}

export const verifyOtp = async (req,res)=>{
    try {
        const {userId, otp} = req.body;
        if(!userId || !otp){
            return res.status(500).send("Enter otp");
        }

        const userOtp = await otpVerify.find({userId: userId});

        if(!userOtp)
            return res.status(500).send("Acount record does not exist or already verified");

        const { expiresAt } = userOtp[0];
        const hashedOtp = userOtp[0].otp;
    
        if(expiresAt < Date.now())
        {
            await otpVerify.deleteMany({ userId: userId})
            return res.status(500).send("OTP has Expired");
        }

        const validOtp = await bcrypt.compare(otp,hashedOtp);

        if(!validOtp)
            return res.status(500).send("Incorrect OTP");
        
        await User.findByIdAndUpdate(userId,{"verified":true});
        await otpVerify.deleteMany({userId:userId});

        res.status(200).send("Email verified");
    } catch (error) {
        res.status(500).json(error);
    }
}