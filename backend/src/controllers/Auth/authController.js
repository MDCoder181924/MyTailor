import jwt from "jsonwebtoken";
import User from "../../models/Auth/User.js";
import Tailor from "../../models/Auth/Tailor.js";

export const getCurrentAccount = async (req, res) => {
    try {
        if (req.user.role === "user") {
            const user = await User.findById(req.user.id).select("-userPassword -refreshToken");

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.json({
                message: "Current user fetched",
                role: "user",
                user
            });
        }

        if (req.user.role === "tailor") {
            const tailor = await Tailor.findById(req.user.id).select("-tailorPassword -refreshToken");

            if (!tailor) {
                return res.status(404).json({ message: "Tailor not found" });
            }

            return res.json({
                message: "Current tailor fetched",
                role: "tailor",
                tailor
            });
        }

        return res.status(403).json({ message: "Invalid role" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id);
        const tailor = await Tailor.findById(decoded.id);

        const account = user || tailor;

        if (!account || account.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const role = user ? "user" : "tailor";

        const newAccessToken = jwt.sign(
            { id: decoded.id, role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000
        });

        res.json({ message: "Token refreshed", accessToken: newAccessToken });

    } catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
