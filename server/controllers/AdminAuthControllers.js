import bcrypt from "bcryptjs"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { Admin } from "../models/User.js";
import { config } from "dotenv"
import { sendForgotPasswordEmail, sendResetPasswordEmail } from "../utils/mailer.utils.js";
config();

export const signup = async (req ,res ) => {
    const {email , password } = req.body;
    try {
        if(!email || !password) {
            throw new Error("All fields are required ");
        }

        const isAdminExits = await Admin.findOne({email});

        if(isAdminExits) {
            return res.status(200).json({message : "Admin already exits with provided creadentials" , success : false})
        }

        const hashedpassword = await bcrypt.hash(password , 10);
        const admin = new Admin({
            email ,
            password : hashedpassword ,
        });

        await admin.save();

        const token = jwt.sign({userId : admin._id} , process.env.JWT_SECRET , {expiresIn : "7d"});

        res.cookie("authToken" , token , {
            httpOnly : true ,
            sameSite : "strict" ,
            secure : process.env.NODE_ENV === "production" ,
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message : "Admin craeted succussfully" ,
            success : true ,
            admin : {
                ...admin._doc ,
                password : undefined
            }
        })


    } catch (error) {
        console.log("Error registering up" , error)
        return res.status(500).json({error : error.message , success : false})
    }
}



export const login = async (req , res) => {
    const {email , password} = req.body;
    try {
        const admin = await Admin.findOne({email}) ;

        if(!admin) {
            return res.status(200).json({message : "Email not found" , success : false})
        }
        
        const isPasswordMatched = await bcrypt.compare(password , admin.password) ;
        if(!isPasswordMatched) {
            return res.status(200).json({message : "Incorrect password" , success : false})
        }


        const token = jwt.sign({userId : admin._id} , process.env.JWT_SECRET , {expiresIn : "7d"});
        
                res.cookie("authToken" , token , {
                    httpOnly : true ,
                    sameSite : "strict" ,
                    secure : process.env.NODE_ENV === "production" ,
                    maxAge : 7 * 24 * 60 * 60 * 1000
                });
        
        return res.status(200).json({
            success : true,
            message : "Logged in successfully" ,
            admin : {
                ...admin._doc ,
                password : undefined
            },
            userId : admin._id
        })
    } catch (error) {
        console.log("Errorin login admin" , error.message)
        return res.status(500).json({message : "Error loggin in",error : error.message , success : false})
    }
}


export const logout = async (req  , res) => {
    res.clearCookie("authToken", {
        httpOnly: true, // Match the cookie's httpOnly option
        sameSite: "strict", // Same sameSite policy as when setting
        secure: process.env.NODE_ENV === "production", // Match secure setting
        path : "/"
    });

    return res.status(200).json({message : "user logedout succussfully"})
}



export const checkAuth = async  ( req , res ) => {
    try {
        const admin = await Admin.findById(req.userId).select("-password");

        if(!admin) {
            return res.status(400).json({success : false , message : "Admin not found"} )
        }

        return res.status(200).json({
            success : true ,
            admin
        })
    } catch (error) {
        
    }
}


export const forgotPassword = async (req , res) => {
    const {email} = req.body;
    try {
        const admin = await Admin.findOne({email}) ;

        if(!admin) {
            return res.status(200).json({success : false , message : "Email not found"} )
        }

        const token = Math.floor(Math.random() * 900000 + 100000).toString()
        admin.resetPasswordVerificationToken = token ;
        admin.resetPasswordVerificationTokenExpiresAt = Date.now() + 5 * 60 * 1000 ;

        await admin.save();
        const data={
            email:admin.email,
            otp : token
        }
        await sendForgotPasswordEmail(data);
        return res.status(200).json({message : "otp sent succussfully" , success : true});
    } catch (error) {
        console.log("Error in forgot password" , error)
        return res.status(500).json({message : "Internal server Error" , success : false})
    }
}


export const verifyOTP = async (req , res) => {
    const {code} = req.body;
    try {
        const admin = await Admin.findOne({
            resetPasswordVerificationToken : code ,
            resetPasswordVerificationTokenExpiresAt : {$gt : Date.now()}
        });

        if(!admin) {
            return res.status(200).json({message : "Invalid or OTP expired" , success : false})
        }

        admin.resetPasswordVerificationToken = undefined;
        admin.resetPasswordVerificationTokenExpiresAt = undefined;
        
        const randomToken = crypto.randomBytes(20).toString('hex')

        admin.verificationToken = randomToken;
        await admin.save()

        return res.status(200).json({
            message : "OTP VERIFIED" ,
            token : randomToken ,
            success : true 
        })
    } catch (error) {
        console.log("Error veriffying OTP" , error.message)
        return res.status(500).json({message : "Internal server Error."})
    }
}

export const resetPassword = async (req , res) => {
    const {password} = req.body ;
    const {token} = req.params;
    try {
        const admin = await Admin.findOne({
            verificationToken : token ,
        });


        if(!admin) {
            return res.status(400).json({message : "Password Reset Failed , Try Again." , success : false})
        }

        const hashedPassword = await bcrypt.hash(password , 10) ;

        admin.password = hashedPassword ;
        admin.verificationToken = undefined;

        await admin.save() ;

        const data={
            email:admin.email
        }

       await sendResetPasswordEmail(data)

        return res.status(200).json({success : true , message : "Password reset successfull"})
    } catch (error) {
        console.log("Error in reset password" ,  error) ;
        return res.status(400).json({error : error.message , success : false})
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.userId);
        if (!admin) {
            return res.status(200).json({ message: 'Admin not found' , success : false });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(200).json({ message: 'Incorrect current password' , success : false });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: 'Password changed successfully' , success : true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' , success : false, error });
    }
};
