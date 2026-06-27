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

export const getProductsByTailorId = async (req, res) => {
  try {
    const products = await Product.find({ tailor: req.params.tailorId })
      .populate("tailor", tailorSelect)
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, category, price, stock, fabrics, sizes, image } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.tailor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this product" });
    }

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
    if (sizes !== undefined) product.sizes = Array.isArray(sizes) ? sizes : [];
    if (image !== undefined) product.image = image || "";

    await product.save();
    
    const updatedProduct = await Product.findById(id).populate("tailor", tailorSelect);

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.tailor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);

    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

