import Tailor from "../../models/Auth/Tailor.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const normalizeStringArray = (value) => {
    if (!Array.isArray(value)) {
        return undefined;
    }

    return [...new Set(
        value
            .filter((item) => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean)
    )];
};

export const tailorLogin = async (req, res) => {
    try {
        const tailorEmail = req.body.tailorEmail?.trim().toLowerCase();
        const { tailorPassword } = req.body;

        if (!tailorEmail || !tailorPassword) {
            return res.status(400).json({ message: "Email and password are required" });
        }

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
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            tailor: safeTailor,
            accessToken
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const tailorSignup = async (req, res) => {
    try {
        const tailorName = req.body.tailorName?.trim();
        const tailorEmail = req.body.tailorEmail?.trim().toLowerCase();
        const tailorMobileNumber = req.body.tailorMobileNumber?.replace(/\D/g, "");
        const { tailorPassword } = req.body;

        if (!tailorName || !tailorEmail || !tailorMobileNumber || !tailorPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (tailorMobileNumber.length < 10) {
            return res.status(400).json({ message: "Enter a valid mobile number" });
        }

        const isRagister = await Tailor.findOne({ tailorEmail });

        if (isRagister) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const existingMobile = await Tailor.findOne({ tailorMobileNumber });

        if (existingMobile) {
            return res.status(400).json({ message: "Mobile number already exists" });
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
        if (err.code === 11000) {
            if (err.keyPattern?.tailorEmail) {
                return res.status(400).json({ message: "Email already exists" });
            }

            if (err.keyPattern?.tailorMobileNumber) {
                return res.status(400).json({ message: "Mobile number already exists" });
            }

            return res.status(400).json({ message: "Tailor already exists" });
        }

        res.status(500).json({ message: err.message });
    }
};

export const getAllTailors = async (_req, res) => {
    try {
        const tailors = await Tailor.find()
            .select("-tailorPassword -refreshToken")
            .sort({ createdAt: -1 });

        res.json({ tailors });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTailorById = async (req, res) => {
    try {
        const tailor = await Tailor.findById(req.params.id).select("-tailorPassword -refreshToken");

        if (!tailor) {
            return res.status(404).json({ message: "Tailor not found" });
        }

        return res.json({ tailor });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateTailorProfile = async (req, res) => {
    try {
        const tailor = await Tailor.findById(req.user.id);

        if (!tailor) {
            return res.status(404).json({ message: "Tailor not found" });
        }

        const {
            tailorName,
            tailorMobileNumber,
            profilePhoto,
            professionalTitle,
            shopName,
            shopAddress,
            shopDescription,
            yearsOfExperience,
            specializations,
            keySkills,
            identityStatus,
        } = req.body;

        if (typeof tailorName === "string") {
            const trimmedName = tailorName.trim();

            if (!trimmedName) {
                return res.status(400).json({ message: "Name is required" });
            }

            tailor.tailorName = trimmedName;
        }

        if (typeof tailorMobileNumber === "string") {
            const trimmedMobile = tailorMobileNumber.trim();

            if (!trimmedMobile) {
                return res.status(400).json({ message: "Mobile number is required" });
            }

            const existingTailor = await Tailor.findOne({
                tailorMobileNumber: trimmedMobile,
                _id: { $ne: tailor._id },
            });

            if (existingTailor) {
                return res.status(400).json({ message: "Mobile number already exists" });
            }

            tailor.tailorMobileNumber = trimmedMobile;
        }

        if (typeof profilePhoto === "string") {
            tailor.profilePhoto = profilePhoto.trim();
        }

        if (typeof professionalTitle === "string") {
            tailor.professionalTitle = professionalTitle.trim();
        }

        if (typeof shopName === "string") {
            tailor.shopName = shopName.trim();
        }

        if (typeof shopAddress === "string") {
            tailor.shopAddress = shopAddress.trim();
        }

        if (typeof shopDescription === "string") {
            tailor.shopDescription = shopDescription.trim();
        }

        if (yearsOfExperience !== undefined) {
            const parsedYears = Number(yearsOfExperience);

            if (Number.isNaN(parsedYears) || parsedYears < 0) {
                return res.status(400).json({ message: "Years of experience must be 0 or more" });
            }

            tailor.yearsOfExperience = parsedYears;
        }

        const normalizedSpecializations = normalizeStringArray(specializations);
        if (normalizedSpecializations !== undefined) {
            tailor.specializations = normalizedSpecializations;
        }

        const normalizedKeySkills = normalizeStringArray(keySkills);
        if (normalizedKeySkills !== undefined) {
            tailor.keySkills = normalizedKeySkills;
        }

        if (typeof identityStatus === "string") {
            tailor.identityStatus = identityStatus.trim() || "Verified";
        }

        await tailor.save();

        const safeTailor = await Tailor.findById(tailor._id).select("-tailorPassword -refreshToken");

        return res.json({
            message: "Tailor profile updated",
            tailor: safeTailor,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const tailorLogout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const tailor = await Tailor.findById(decoded.id);

                if (tailor) {
                    tailor.refreshToken = null;
                    await tailor.save();
                }
            } catch {
                // Ignore invalid refresh tokens during logout.
            }
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.json({ message: "Tailor logged out" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
