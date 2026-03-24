import User from "../../models/Auth/User.js";
import bcrypt from "bcrypt"

export const signupUser = async(req , res)=>{
    try{
        const {userFullName,userEmail , userPassword} = req.body;
        const emailIsRagister = await User.findOne({userEmail});
        if(emailIsRagister){
            return res.status(400).json({message : "Email already exists"})
        }
        const bcPassword = await bcrypt.hash(userPassword,10);
        const user = new User({
            userFullName,
            userEmail ,
            userPassword:bcPassword
        })

        await user.save();
        res.json({ message: "User Registered" });

    }catch(err){
        res.status(500).json({error:err.message})
    }
}


export const loginUser =async(req,res)=>{
    try{
        const {userEmail , userPassword} = req.body;

        const user= await User.findOne({userEmail})

        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        const isOkPassword = await bcrypt.compare(userPassword , user.userPassword)

        if(!isOkPassword){
            return res.status(400).json({message:"Wrong password"})
        }
        const { userPassword: _, ...safeUser } = user._doc;
        res.json({message:"Login successful" ,user:safeUser});
    }catch(err){
        return res.status(500).json({mesaage:err.message})
    }
}