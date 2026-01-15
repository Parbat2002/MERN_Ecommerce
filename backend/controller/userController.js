import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";


export const registerUser =handleAsyncError(async (req, res, next) => {
const {name,email,password}=req.body;

const user=await User.create({
    name,
    email,
    password,
    avatar:{
        public_id:"this is a sample id",
        url:"temproary"
    }
})
    sendToken(user,201,res);
})

// Login
export const loginUser =handleAsyncError(async (req, res, next) => {
    const {email,password}=req.body;
    if(!email || !password){
        return next(new HandleError("Please enter email and password",400))
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new HandleError("Invalid email or password",401))
    }

    const isPasswordValid=await user.verifyPassword(password);
    if(!isPasswordValid){
        return next(new HandleError("Invalid email or password",401))
    }
   
    sendToken(user,200,res);
    
})

// Logout
export const logout =handleAsyncError(async (req, res, next) => {

 res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
 })

res.status(200).json({
    success:true,
    message:"Logged out successfully"
})

})