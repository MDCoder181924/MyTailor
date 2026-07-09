import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/Auth/User.js";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  return Number.isNaN(numericPrice) ? "$0" : `$${numericPrice}`;
};

const buildOrderNo = () => `#ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`;

const sanitizeOrderImage = (image) => (typeof image === "string" ? image.trim() : "");

const toUserOrder = (order) => ({
  id: order._id,
  userId: order.user?._id || order.user,
  productId: order.product?._id || order.product,
  orderNo: order.orderNo,
  estCompletion: order.estCompletion,
  title: order.productName,
  tailor: order.tailorName,
  price: formatPrice(order.price),
  stage: order.stage,
  stageIndex: order.stageIndex,
  img: sanitizeOrderImage(order.productImage),
  actions: [
    { label: "Track Order", primary: true },
    { label: "View Details", primary: false },
  ],
  quickLinks: [
    { icon: "MSG", label: "Message Tailor" },
    { icon: "FAB", label: "Fabric Specs" },
  ],
  category: order.category,
  createdAt: order.createdAt,
  selectedFabric: order.selectedFabric,
  selectedSize: order.selectedSize,
  deliveryName: order.deliveryName,
  deliveryAddress: order.deliveryAddress,
  deliveryMethod: order.deliveryMethod,
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  status: order.status,
});

const toTailorOrder = (order) => ({
  id: order.orderNo,
  backendId: order._id,
  userId: order.user?._id || order.user,
  productId: order.product?._id || order.product,
  date: new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }),
  name: order.customerName,
  product: order.productName,
  desc: [order.productCategory, order.selectedFabric, order.selectedSize].filter(Boolean).join(" | "),
  status: order.status,
  total: formatPrice(order.price),
  productImage: sanitizeOrderImage(order.productImage),
  deliveryName: order.deliveryName,
  deliveryAddress: order.deliveryAddress,
  deliveryMethod: order.deliveryMethod,
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  selectedSize: order.selectedSize,
  selectedBrand: order.selectedBrand,
  clothingType: order.clothingType,
  customMeasurements: order.customMeasurements,
  createdAt: order.createdAt,
});

const toTailorNotification = (order) => {
  let title = "New Product Order";
  let message = `${order.customerName} placed an order for ${order.productName}.`;

  if (order.status === "SHIPPED") {
    if (order.stage === "COLLECTED") {
      title = "Order Collected";
      message = `${order.customerName} has collected order ${order.orderNo} from the shop.`;
    } else if (order.stage === "DELIVERED") {
      title = "Delivery Confirmed";
      message = `${order.customerName} has confirmed delivery for order ${order.orderNo}.`;
    }
  }

  return {
    id: `tailor-order-${order._id}-${order.status}-${order.stage}`,
    title,
    message,
    orderId: order.orderNo,
    createdAt: order.updatedAt || order.createdAt,
    read: order.tailorNotificationRead,
  };
};

export const createOrder = async (req, res) => {
  try {
    const {
      productId,
      selectedFabric = "",
      selectedSize = "",
      selectedBrand = "",
      clothingType = "",
      customMeasurements = null,
      deliveryName = "",
      deliveryAddress = "",
      deliveryMethod = "delivery",
      paymentMethod = "card",
    } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product is required" });
    }

    if (!deliveryName.trim() || !deliveryAddress.trim()) {
      return res.status(400).json({ message: "Delivery details are required" });
    }

    const [product, user] = await Promise.all([
      Product.findById(productId).populate("tailor", "tailorName disabledSizes"),
      User.findById(req.user.id).select("userFullName"),
    ]);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let baseSize = String(selectedSize || "").trim();
    if (baseSize.includes("(")) {
      baseSize = baseSize.split("(")[0].trim();
    }

    if (
      product.tailor?.disabledSizes &&
      product.tailor.disabledSizes.some(
        (ds) => ds.toUpperCase() === baseSize.toUpperCase()
      )
    ) {
      return res.status(400).json({
        message: `The size "${baseSize}" is unavailable because the tailor cannot make this size.`,
      });
    }

    const order = await Order.create({
      orderNo: buildOrderNo(),
      user: user._id,
      tailor: product.tailor?._id || product.tailor,
      product: product._id,
      productName: product.productName,
      productCategory: product.category,
      tailorName: product.tailor?.tailorName || "Assigned Tailor",
      customerName: user.userFullName || "Customer",
      productImage: sanitizeOrderImage(product.image),
      price: Number(product.price) || 0,
      selectedFabric: String(selectedFabric || "").trim(),
      selectedSize: String(selectedSize || "").trim(),
      selectedBrand: String(selectedBrand || "").trim(),
      clothingType: String(clothingType || "").trim(),
      customMeasurements: customMeasurements || null,
      deliveryName: deliveryName.trim(),
      deliveryAddress: deliveryAddress.trim(),
      deliveryMethod: String(deliveryMethod || "delivery").trim(),
      paymentStatus: String(paymentMethod || "card").trim() === "cod" ? "unpaid" : "paid", // Auto-pay except COD
      paymentMethod: String(paymentMethod || "card").trim(),
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "userFullName")
      .populate("tailor", "tailorName")
      .populate("product", "productName");

    return res.status(201).json({
      message: "Order created successfully",
      order: toUserOrder(populatedOrder),
      tailorOrder: toTailorOrder(populatedOrder),
      tailorNotification: toTailorNotification(populatedOrder),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.json({
      orders: orders.map(toUserOrder),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getTailorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ tailor: req.user.id }).sort({ createdAt: -1 });

    return res.json({
      orders: orders.map(toTailorOrder),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getTailorNotifications = async (req, res) => {
  try {
    const orders = await Order.find({ tailor: req.user.id }).sort({ createdAt: -1 }).limit(20);

    return res.json({
      notifications: orders.map(toTailorNotification),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const markTailorNotificationsRead = async (req, res) => {
  try {
    await Order.updateMany(
      { tailor: req.user.id, tailorNotificationRead: false },
      { $set: { tailorNotificationRead: true } }
    );

    const orders = await Order.find({ tailor: req.user.id }).sort({ createdAt: -1 }).limit(20);

    return res.json({
      message: "Notifications marked as read",
      notifications: orders.map(toTailorNotification),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, tailor: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.estCompletion = "COMPLETED";
    order.category = "active";
    order.userNotificationRead = false;

    if (order.deliveryMethod === "pickup") {
      order.stage = "READY_FOR_PICKUP";
      order.stageIndex = 4;
      order.status = "ACCEPTED";
    } else {
      order.stage = "READY_TO_SHIP";
      order.stageIndex = 4;
      order.status = "ACCEPTED";
    }

    await order.save();

    return res.json({
      message: "Order marked as completed",
      order: toTailorOrder(order),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const shipOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, tailor: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryMethod !== "delivery") {
      return res.status(400).json({ message: "Only home delivery orders can be shipped" });
    }

    order.status = "SHIPPED";
    order.stage = "SHIPPED";
    order.userNotificationRead = false;
    await order.save();

    return res.json({
      message: "Order shipped successfully",
      order: toTailorOrder(order),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, tailor: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "paid";
    order.userNotificationRead = false;
    await order.save();

    return res.json({
      message: "Payment marked as confirmed",
      order: toTailorOrder(order),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const collectOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      $or: [{ user: req.user.id }, { tailor: req.user.id }]
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryMethod === "pickup" && order.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Cannot collect unpaid order. Tailor must mark as paid first." });
    }

    order.status = "SHIPPED";
    order.category = "archive";
    order.stage = order.deliveryMethod === "pickup" ? "COLLECTED" : "DELIVERED";
    order.userNotificationRead = true;
    order.tailorNotificationRead = false;
    await order.save();

    return res.json({
      message: order.deliveryMethod === "pickup" ? "Order collected successfully" : "Delivery confirmed successfully",
      order: toUserOrder(order),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, tailor: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({ message: "Order is already accepted or shipped" });
    }

    order.status = "ACCEPTED";
    order.estCompletion = "IN PROGRESS";
    order.stage = "MEASURING";
    order.stageIndex = 0;
    order.userNotificationRead = false;
    await order.save();

    return res.json({
      message: "Order accepted successfully",
      order: toTailorOrder(order),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
