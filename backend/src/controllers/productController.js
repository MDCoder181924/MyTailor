import Product from "../models/Product.js";

const tailorSelect = "tailorName tailorEmail tailorMobileNumber createdAt updatedAt";

export const createProduct = async (req, res) => {
  try {
    const { productName, description, category, price, stock, fabrics, sizes, image } = req.body;
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!productName?.trim() || !category?.trim()) {
      return res.status(400).json({ message: "Product name and category are required" });
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: "Valid price is required" });
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ message: "Valid stock is required" });
    }

    const newProduct = await Product.create({
      productName: productName.trim(),
      description: description?.trim() || "",
      category: category.trim(),
      price: parsedPrice,
      stock: parsedStock,
      fabrics: Array.isArray(fabrics) ? fabrics : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      image: image || "",
      tailor: req.user.id,
    });

    const product = await Product.findById(newProduct._id).populate("tailor", tailorSelect);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find()
      .populate("tailor", tailorSelect)
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTailorProducts = async (req, res) => {
  try {
    const products = await Product.find({ tailor: req.user.id })
      .populate("tailor", tailorSelect)
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
