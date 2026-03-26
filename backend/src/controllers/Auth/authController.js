import jwt from "jsonwebtoken";
import User from "../../models/Auth/User.js";
import Tailor from "../../models/Auth/Tailor.js";

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
            { id: decoded.id, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000
        });

        res.json({ message: "Token refreshed" });

    } catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};