import Tailor from "../../models/Auth/Tailor.js";

import bcrypt from "bcrypt"

export const tailorLogin = async (req, res) => {
    try {
        const { tailorEmail, tailorPassword } = req.body;

        const tailor = await Tailor.findOne({ tailorEmail });

        if (!tailor) {
            return res.status(400).json({ message: "Tailor not found" });
        }

        const isPasswordOk = await bcrypt.compare(tailorPassword , tailor.tailorPassword)

        if (!isPasswordOk) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const {tailorPassword: _, ...safeTailor} = tailor._doc;

        res.json({ message: "Login successful", tailor : safeTailor });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const tailorSignup = async (req, res) => {
    try {
        const { tailorName, tailorEmail, tailorMobileNumber, tailorPassword } = req.body;
        const isRagister = await Tailor.findOne({tailorEmail})

        if(isRagister){
            return res.status(400).json({message :"Email already exists"})
        }

        const bcPassword = await bcrypt.hash(tailorPassword , 10);

        const newTailor = new Tailor({
            tailorName,
            tailorEmail,
            tailorMobileNumber,
            tailorPassword : bcPassword
        });

        await newTailor.save();

        res.json({ message: "Tailor Registered" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};