import User from "../../models/Auth/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

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

export const signupUser = async (req, res) => {
    try {
        const { userFullName, userEmail, userPassword } = req.body;
        const emailIsRagister = await User.findOne({ userEmail });
        if (emailIsRagister) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const bcPassword = await bcrypt.hash(userPassword, 10);
        const user = new User({
            userFullName,
            userEmail,
            userPassword: bcPassword
        })

        await user.save();
        res.json({ message: "User Registered" });

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


export const loginUser = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        const user = await User.findOne({ userEmail })

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        const isOkPassword = await bcrypt.compare(userPassword, user.userPassword)
        
        if (!isOkPassword) {
            return res.status(400).json({ message: "Wrong password" })
        }
        const { userPassword: _, ...safeUser } = user._doc;
        const accessToken = jwt.sign(
            { id: user._id, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );
        
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            user: safeUser,
            accessToken
        });
    } catch (err) {
        return res.status(500).json({ mesaage: err.message })
    }
}

export const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
            user.refreshToken = null;
            await user.save();
        }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out" });
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const {
            userFullName,
            userMobileNumber,
            profilePhoto,
            preferredStyle,
            deliveryAddress,
            bodyNotes,
            stylePreferences,
            currentPassword,
            newPassword,
        } = req.body;

        if (typeof userFullName === "string") {
            const trimmedName = userFullName.trim();

            if (!trimmedName) {
                return res.status(400).json({ message: "Full name is required" });
            }

            user.userFullName = trimmedName;
        }

        if (typeof userMobileNumber === "string") {
            user.userMobileNumber = userMobileNumber.trim();
        }

        if (typeof profilePhoto === "string") {
            user.profilePhoto = profilePhoto.trim();
        }

        if (typeof preferredStyle === "string") {
            user.preferredStyle = preferredStyle.trim() || "CLASSIC BESPOKE CLIENT";
        }

        if (typeof deliveryAddress === "string") {
            user.deliveryAddress = deliveryAddress.trim();
        }

        if (typeof bodyNotes === "string") {
            user.bodyNotes = bodyNotes.trim();
        }

        const normalizedPreferences = normalizeStringArray(stylePreferences);
        if (normalizedPreferences !== undefined) {
            user.stylePreferences = normalizedPreferences;
        }

        if (currentPassword || newPassword) {
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: "Current password and new password are required" });
            }

            if (String(newPassword).trim().length < 6) {
                return res.status(400).json({ message: "New password must be at least 6 characters" });
            }

            const isPasswordOk = await bcrypt.compare(currentPassword, user.userPassword);

            if (!isPasswordOk) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            user.userPassword = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        const safeUser = await User.findById(user._id).select("-userPassword -refreshToken");

        return res.json({
            message: "User profile updated",
            user: safeUser,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const tailorLogout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tailor = await Tailor.findById(decoded.id);

    if (tailor) {
      tailor.refreshToken = null;
      await tailor.save();
    }
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Tailor logged out" });
};
