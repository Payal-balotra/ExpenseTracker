const jwt = require("jsonwebtoken");
const User = require("../models/User");



//generating token
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"1h"})
}


const registerUser = async(req,res) => {
    const {fullName,email,password,profileImgUrl} = req.body;
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        //check if user already exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"})
        }
        const user = await User.create({
            fullName,
            email,
            password,
            profileImgUrl
        }) 
        if(user){
            return res.status(201).json({
                id: user._id,
                user,
                token: generateToken(user._id)
            })
        }
    }catch(error){
        return res.status(500).json({message:"Server error"})
    }

}

const loginUser = async (req,res) => {
    const {email,password} = req.body;
    console.log("Login API hit with data:", req.body);
    try{
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }
        //compare password
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        return res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })
    }catch(error){
        return res.status(500).json({message:"Server error"})
    }
}
const getUserInfo = async (req,res) => {
        try{
            const user = await User.findById(req.user.id).select("-password");
            if(!user){
                return res.status(404).json({message:"User not found"});
            }
            return res.status(200).json(user);
        }catch(error){
            return res.status(500).json({message:"Server error"});
        }
}

module.exports = {registerUser,loginUser,getUserInfo}