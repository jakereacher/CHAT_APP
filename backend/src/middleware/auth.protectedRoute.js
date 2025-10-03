import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import STATUS_CODES from "../lib/statuscodes.js"



export const protectedRoute = async (req,res,next) => {
    try {

        const token = req.cookies.jwt

        if(!token) return res.status(STATUS_CODES.UNAUTHORIZED).json({message:"Unauthorized - No token provided"})

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

       if(!decoded){
        return res.status(STATUS_CODES.UNAUTHORIZED).json({message:"Unauthorized - Invalid token"})
       }

       const user = await User.findById(decoded.userId).select("-password")

       if(!user){
        return res.status(STATUS_CODES.NOT_FOUND).json({message:"User not found"})
       }

       req.user = user

       next()

    } catch (error) {
        console.log("Error in protectedRoute middleware",error.message)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}