const User = require("../models/UserModel");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.status(200).json({message:"Login successful",user:{
            _id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
            token
        }});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

exports.register=async(req,res)=>{
    try {
        const {username,email,role,password,confirmPassword}=req.body;
        if (!username || !email || !role || !password || !confirmPassword) {
          return res.status(400).json({ message: "All fields are required" });
        }

        if(role.toLowerCase()!=="organizer" && role.toLowerCase()!=="attendee"){
            return res.status(400).json({message:"Invalid role"});
        }

        if(password!==confirmPassword){
            return res.status(400).json({message:"Password and confirm password do not match"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await User.create({username,email,role:role.toLowerCase(),password:hashedPassword});
        if(!newUser){
            return res.status(400).json({message:"Failed to register user"});
        }
        res.status(201).json({message:"User registered successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

exports.logout=async(req,res)=>{
    try {
        res.clearCookie("token");
        console.log("Logout successful");
        res.status(200).json({message:"Logout successful"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

