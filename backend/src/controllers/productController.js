import Product from "../models/Product.js";

const tailorSelect = "tailorName tailorEmail tailorMobileNumber disabledSizes createdAt updatedAt";

export const createProduct = async (req, res) => {
  try {
    const { productName, description, category, price, stock, fabrics, image } = req.body;
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

export const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);
    const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
    const filter = {};

    // Keep category matching compatible with the frontend's "shirt", "t-shirt"
    // and "t shirt" normalization.
    if (category && category.toLowerCase() !== "all") {
      const normalizedCategory = category
        .trim()
        .replace(/[-_\s]+/g, " ")
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\s+/g, "[-_\\s]+");
      filter.category = { $regex: new RegExp(`^${normalizedCategory}$`, "i") };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
      .populate("tailor", tailorSelect)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        hasMore: page * limit < total,
      },
    });
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
    const { productName, description, category, price, stock, fabrics, image } = req.body;

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
