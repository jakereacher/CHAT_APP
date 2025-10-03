import User from "../models/user.model.js";
import STATUS_CODES from "../lib/statuscodes.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req,res) =>{
    const {fullname,email,password} = req.body
    try {

        if(!fullname||!email||!password) return res.status(STATUS_CODES.BAD_REQUEST).json({message:"All fields are required"})

        if(password.length < 6){
            return res.status(STATUS_CODES.BAD_REQUEST).json({message:"Password should have minimum 6 characters"});
        }

        const user = await User.findOne({email})

        if(user) return res.status(STATUS_CODES.BAD_REQUEST).json({message:"User already exists"})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullname:fullname,
            email:email,
            password:hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res)

            await newUser.save()

            res.status(STATUS_CODES.CREATED).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilePic,
            })
        }else{
            res.status(STATUS_CODES.BAD_REQUEST).json({message:"Invalid User Data"})
        }
    } catch (error) {
        console.log("Signup error " + error.message)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message:"internal server error"})
    }
}

export const login = async (req,res) =>{
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})

        if(!user) return res.status(STATUS_CODES.BAD_REQUEST).json({message:"Invalid Credentials"})

        const isPassword = await bcrypt.compare(password,user.password)

        if(!isPassword) return res.status(STATUS_CODES.BAD_REQUEST).json({message:"Wrong password"})

         generateToken(user._id,res)

        //   res.status(STATUS_CODES.OK).json({
        //         _id:user._id,
        //         fullname:user.fullname,
        //         email:user.email,
        //         profilePic:user.profilePic,
        //     })
        res.status(STATUS_CODES.OK).json(user)

    } catch (error) {
        console.log("login error " + error.message)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message:"internal server error"})
    }
}

export const logout = (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(STATUS_CODES.OK).json({message:"logged out successfully"})
    } catch (error) {
        console.log("logout error " + error.message)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message:"internal server error"})
    }
}

export const updateProfile = async (req,res)=>{
    try {
        const {profilePic} = req.body
        const userId = req.user._id

        if(!profilePic){
            return res.status(STATUS_CODES.BAD_REQUEST).json({message:"Profile Pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        res.status(STATUS_CODES.OK).json(updatedUser)
    } catch (error) {
        console.log("update profile error " + error.message)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message:"internal server error"})
    }
}

export const checkAuth = async (req,res)=>{
    try {
        res.status(STATUS_CODES.OK).json(req.user)
    } catch (error) {

        console.log("Error in CheckAuth ",error.message)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}