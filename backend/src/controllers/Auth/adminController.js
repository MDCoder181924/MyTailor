import Admin from "../../models/Auth/Admin.js";
import User from "../../models/Auth/User.js";
import Tailor from "../../models/Auth/Tailor.js";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import Review from "../../models/Review.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ─── Create Admin (Postman only) ──────────────────────────────────────────────
export const createAdmin = async (req, res) => {
    try {
        const { adminName, adminEmail, adminPassword } = req.body;

        if (!adminName || !adminEmail || !adminPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (String(adminPassword).trim().length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingAdmin = await Admin.findOne({ adminEmail: adminEmail.trim().toLowerCase() });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const admin = new Admin({
            adminName: adminName.trim(),
            adminEmail: adminEmail.trim().toLowerCase(),
            adminPassword: hashedPassword,
        });

        await admin.save();

        res.status(201).json({ message: "Admin created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Admin Login ──────────────────────────────────────────────────────────────
export const loginAdmin = async (req, res) => {
    try {
        const adminEmail = req.body.adminEmail?.trim().toLowerCase();
        const { adminPassword } = req.body;

        if (!adminEmail || !adminPassword) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ adminEmail });

        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        const isPasswordOk = await bcrypt.compare(adminPassword, admin.adminPassword);

        if (!isPasswordOk) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const { adminPassword: _, ...safeAdmin } = admin._doc;

        const accessToken = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: admin._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        admin.refreshToken = refreshToken;
        await admin.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Admin login successful",
            admin: safeAdmin,
            accessToken,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Admin Logout ─────────────────────────────────────────────────────────────
export const logoutAdmin = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const admin = await Admin.findById(decoded.id);
                if (admin) {
                    admin.refreshToken = null;
                    await admin.save();
                }
            } catch {
                // Ignore invalid refresh tokens during logout
            }
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.json({ message: "Admin logged out" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = async (_req, res) => {
    try {
        const [totalUsers, totalTailors, totalProducts, totalOrders, orders] = await Promise.all([
            User.countDocuments(),
            Tailor.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.find({ paymentStatus: "paid" }).select("price"),
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.price) || 0), 0);

        const pendingOrders = await Order.countDocuments({ status: "PENDING" });
        const activeOrders = await Order.countDocuments({ status: "ACCEPTED" });
        const shippedOrders = await Order.countDocuments({ status: "SHIPPED" });
        const cancelledOrders = await Order.countDocuments({ status: "CANCELLED" });

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("user", "userFullName userEmail")
            .populate("tailor", "tailorName tailorEmail")
            .populate("product", "productName");

        const totalReviews = await Review.countDocuments();

        res.json({
            stats: {
                totalUsers,
                totalTailors,
                totalProducts,
                totalOrders,
                totalRevenue,
                totalReviews,
                pendingOrders,
                activeOrders,
                shippedOrders,
                cancelledOrders,
            },
            recentOrders,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Users CRUD ───────────────────────────────────────────────────────────────
export const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find()
            .select("-userPassword -refreshToken")
            .sort({ createdAt: -1 });

        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const {
            userFullName,
            userEmail,
            userMobileNumber,
            profilePhoto,
            preferredStyle,
            deliveryAddress,
            bodyNotes,
            stylePreferences,
        } = req.body;

        if (typeof userFullName === "string") user.userFullName = userFullName.trim();
        if (typeof userEmail === "string") {
            const trimmedEmail = userEmail.trim().toLowerCase();
            const existing = await User.findOne({ userEmail: trimmedEmail, _id: { $ne: user._id } });
            if (existing) {
                return res.status(400).json({ message: "Email already exists" });
            }
            user.userEmail = trimmedEmail;
        }
        if (typeof userMobileNumber === "string") user.userMobileNumber = userMobileNumber.trim();
        if (typeof profilePhoto === "string") user.profilePhoto = profilePhoto.trim();
        if (typeof preferredStyle === "string") user.preferredStyle = preferredStyle.trim();
        if (typeof deliveryAddress === "string") user.deliveryAddress = deliveryAddress.trim();
        if (typeof bodyNotes === "string") user.bodyNotes = bodyNotes.trim();
        if (Array.isArray(stylePreferences)) user.stylePreferences = stylePreferences;

        await user.save();

        const safeUser = await User.findById(user._id).select("-userPassword -refreshToken");

        res.json({ message: "User updated", user: safeUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Tailors CRUD ─────────────────────────────────────────────────────────────
export const getAllTailorsAdmin = async (_req, res) => {
    try {
        const tailors = await Tailor.find()
            .select("-tailorPassword -refreshToken")
            .sort({ createdAt: -1 });

        res.json({ tailors });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTailor = async (req, res) => {
    try {
        const tailor = await Tailor.findById(req.params.id);

        if (!tailor) {
            return res.status(404).json({ message: "Tailor not found" });
        }

        const {
            tailorName,
            tailorEmail,
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
            disabledSizes,
        } = req.body;

        if (typeof tailorName === "string") tailor.tailorName = tailorName.trim();
        if (typeof tailorEmail === "string") {
            const trimmedEmail = tailorEmail.trim().toLowerCase();
            const existing = await Tailor.findOne({ tailorEmail: trimmedEmail, _id: { $ne: tailor._id } });
            if (existing) {
                return res.status(400).json({ message: "Email already exists" });
            }
            tailor.tailorEmail = trimmedEmail;
        }
        if (typeof tailorMobileNumber === "string") {
            const trimmed = tailorMobileNumber.trim();
            const existing = await Tailor.findOne({ tailorMobileNumber: trimmed, _id: { $ne: tailor._id } });
            if (existing) {
                return res.status(400).json({ message: "Mobile number already exists" });
            }
            tailor.tailorMobileNumber = trimmed;
        }
        if (typeof profilePhoto === "string") tailor.profilePhoto = profilePhoto.trim();
        if (typeof professionalTitle === "string") tailor.professionalTitle = professionalTitle.trim();
        if (typeof shopName === "string") tailor.shopName = shopName.trim();
        if (typeof shopAddress === "string") tailor.shopAddress = shopAddress.trim();
        if (typeof shopDescription === "string") tailor.shopDescription = shopDescription.trim();
        if (yearsOfExperience !== undefined) tailor.yearsOfExperience = Number(yearsOfExperience) || 0;
        if (Array.isArray(specializations)) tailor.specializations = specializations;
        if (Array.isArray(keySkills)) tailor.keySkills = keySkills;
        if (typeof identityStatus === "string") tailor.identityStatus = identityStatus.trim();
        if (Array.isArray(disabledSizes)) tailor.disabledSizes = disabledSizes;

        await tailor.save();

        const safeTailor = await Tailor.findById(tailor._id).select("-tailorPassword -refreshToken");

        res.json({ message: "Tailor updated", tailor: safeTailor });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteTailor = async (req, res) => {
    try {
        const tailor = await Tailor.findById(req.params.id);

        if (!tailor) {
            return res.status(404).json({ message: "Tailor not found" });
        }

        await Tailor.findByIdAndDelete(req.params.id);

        res.json({ message: "Tailor deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Orders CRUD ──────────────────────────────────────────────────────────────
export const getAllOrders = async (_req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "userFullName userEmail")
            .populate("tailor", "tailorName tailorEmail")
            .populate("product", "productName image");

        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const {
            status,
            paymentStatus,
            paymentMethod,
            deliveryMethod,
            stage,
            stageIndex,
            estCompletion,
            category,
            workStarted,
            deliveryName,
            deliveryAddress,
            price,
        } = req.body;

        if (typeof status === "string") order.status = status;
        if (typeof paymentStatus === "string") order.paymentStatus = paymentStatus;
        if (typeof paymentMethod === "string") order.paymentMethod = paymentMethod;
        if (typeof deliveryMethod === "string") order.deliveryMethod = deliveryMethod;
        if (typeof stage === "string") order.stage = stage;
        if (stageIndex !== undefined) order.stageIndex = Number(stageIndex) || 0;
        if (typeof estCompletion === "string") order.estCompletion = estCompletion;
        if (typeof category === "string") order.category = category;
        if (workStarted !== undefined) order.workStarted = Boolean(workStarted);
        if (typeof deliveryName === "string") order.deliveryName = deliveryName.trim();
        if (typeof deliveryAddress === "string") order.deliveryAddress = deliveryAddress.trim();
        if (price !== undefined) order.price = Number(price) || 0;

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate("user", "userFullName userEmail")
            .populate("tailor", "tailorName tailorEmail")
            .populate("product", "productName image");

        res.json({ message: "Order updated", order: updatedOrder });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.json({ message: "Order deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Products CRUD ────────────────────────────────────────────────────────────
export const getAllProductsAdmin = async (_req, res) => {
    try {
        const products = await Product.find()
            .populate("tailor", "tailorName tailorEmail")
            .sort({ createdAt: -1 });

        res.json({ products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProductAdmin = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { productName, description, category, price, stock, fabrics, image } = req.body;

        if (productName !== undefined) product.productName = productName.trim();
        if (description !== undefined) product.description = description?.trim() || "";
        if (category !== undefined) product.category = category.trim();
        if (price !== undefined) {
            const parsedPrice = Number(price);
            if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
                return res.status(400).json({ message: "Valid price is required" });
            }
            product.price = parsedPrice;
        }
        if (stock !== undefined) {
            const parsedStock = Number(stock);
            if (Number.isNaN(parsedStock) || parsedStock < 0) {
                return res.status(400).json({ message: "Valid stock is required" });
            }
            product.stock = parsedStock;
        }
        if (fabrics !== undefined) product.fabrics = Array.isArray(fabrics) ? fabrics : [];
        if (image !== undefined) product.image = image || "";

        await product.save();

        const updatedProduct = await Product.findById(product._id)
            .populate("tailor", "tailorName tailorEmail");

        res.json({ message: "Product updated", product: updatedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteProductAdmin = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Reviews CRUD ─────────────────────────────────────────────────────────────
export const getAllReviews = async (_req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user", "userFullName userEmail profilePhoto")
            .populate("tailor", "tailorName tailorEmail")
            .populate("product", "productName image")
            .populate("order", "orderNo")
            .sort({ createdAt: -1 });

        res.json({ reviews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Also reset the isReviewed flag on the order
        await Order.findByIdAndUpdate(review.order, { isReviewed: false });

        await Review.findByIdAndDelete(req.params.id);

        res.json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
