import Tailor from "../../models/Auth/Tailor.js";

export const tailorLogin = async (req, res) => {
    try {
        const { tailorEmail, tailorPassword } = req.body;

        const tailor = await Tailor.findOne({ tailorEmail });

        if (!tailor) {
            return res.status(400).json({ message: "Tailor not found" });
        }

        if (tailor.tailorPassword !== tailorPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        res.json({ message: "Login successful", tailor });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const tailorSignup = async (req, res) => {
    try {
        const { tailorName, tailorEmail, tailorMobileNumber, tailorPassword } = req.body;

        const newTailor = new Tailor({
            tailorName,
            tailorEmail,
            tailorMobileNumber,
            tailorPassword
        });

        await newTailor.save();

        res.json({ message: "Tailor Registered" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};