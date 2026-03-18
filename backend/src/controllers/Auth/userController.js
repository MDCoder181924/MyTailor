import User from "../../models/Auth/User.js";

export const signupUser = async(req , res)=>{
    try{
        const {userFullName,userEmail , userPassword} = req.body;
        const user = new User({userFullName,userEmail ,userPassword})
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
            return res.status(400).json({mesaage:"user not found"})
        }
        if(user.userPassword!==userPassword){
            return res.status(400).json({mesaage:"Worng password"})
        }
        res.json({message:"Login successful" ,user});
    }catch(err){
        return res.status(500).json({mesaage:err.message})
    }
}