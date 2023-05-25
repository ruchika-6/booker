import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

//CREATE
export const register = async (req,res,next)=>{
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash,
        })
        await newUser.save();
        res.status(200).send("User has been created");
    }
    catch(err){
        res.status(500).json(err);
        // next(err);
    }
}

//CREATE
export const login = async (req,res,next)=>{
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user)
            return res.status(404).send("User not found");
        
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