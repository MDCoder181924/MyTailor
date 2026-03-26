import User from "../../models/Auth/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

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
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
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
            user: safeUser
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