import jwt from "jsonwebtoken"
import { Employee } from '../models/User.js';

export const verifyToken = async ( req , res , next ) => {
    
    try {
        const token = req.cookies.authToken ;
        if(!token) {
            return res.status(400).json({success : false , message : "UnAuthorized - no token provided"})
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET) ;

        if(!decoded) {
            return res.status(400).json({success : false , message : "UnAuthorized - invalid token"})
        }

        req.userId = decoded.userId ;
                
        next();
    } catch (error) {
        console.log("Error in verifyToken" , error) ;
        return res.status(500).json({success : false , message : "Server Error"} );
    }
}


