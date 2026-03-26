import Tailor from "../../models/Auth/Tailor.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

export const tailorLogin = async (req, res) => {
    try {
        const { tailorEmail, tailorPassword } = req.body;

        const tailor = await Tailor.findOne({ tailorEmail });

        if (!tailor) {
            return res.status(400).json({ message: "Tailor not found" });
        }

        const isPasswordOk = await bcrypt.compare(tailorPassword, tailor.tailorPassword)

        if (!isPasswordOk) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const { tailorPassword: _, ...safeTailor } = tailor._doc;
        const accessToken = jwt.sign(
            { id: tailor._id, role: "tailor" },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: tailor._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        tailor.refreshToken = refreshToken;
        await tailor.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            tailor: safeTailor
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const tailorSignup = async (req, res) => {
    try {
        const { tailorName, tailorEmail, tailorMobileNumber, tailorPassword } = req.body;
        const isRagister = await Tailor.findOne({ tailorEmail })

        if (isRagister) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const bcPassword = await bcrypt.hash(tailorPassword, 10);

        const newTailor = new Tailor({
            tailorName,
            tailorEmail,
            tailorMobileNumber,
            tailorPassword: bcPassword
        });

        await newTailor.save();

        res.json({ message: "Tailor Registered" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};