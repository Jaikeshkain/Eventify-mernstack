const jwt=require("jsonwebtoken");
const User = require("../models/UserModel");
const protect=async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token=req.headers.authorization.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select("-password");
            next();
            
        } catch (error) {
            res.status(500).json({ status:false,message: "Not authorized, token failed",data:null });

        }
    }
    if (!token) {
        console.log("Token not found");
        return res.status(201).json({ status:false,message: "Not authorized, token not found",data:null });
      }
}

const isOrganizer=async(req,res,next)=>{
    if(req.user.role==="organizer"){
        next();
    }else{
        console.log("Not authorized, organizer only");
        return res.status(401).json({ status:false,message: "Not authorized, organizer only",data:null });
    }
}

const isAttendee=async(req,res,next)=>{
    if(req.user.role==="attendee"){
        next();
    }else{
        console.log("Not authorized, attendee only");
        return res.status(401).json({ status:false,message: "Not authorized, attendee only",data:null });
    }
}

module.exports={protect,isOrganizer,isAttendee};