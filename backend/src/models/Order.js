import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tailor",
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productCategory: {
      type: String,
      default: "",
      trim: true,
    },
    tailorName: {
      type: String,
      default: "",
      trim: true,
    },
    customerName: {
      type: String,
      default: "",
      trim: true,
    },
    productImage: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    selectedFabric: {
      type: String,
      default: "",
      trim: true,
    },
    selectedSize: {
      type: String,
      default: "",
      trim: true,
    },
    deliveryName: {
      type: String,
      default: "",
      trim: true,
    },
    deliveryAddress: {
      type: String,
      default: "",
      trim: true,
    },
    paymentMethod: {
      type: String,
      default: "card",
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SHIPPED"],
      default: "PENDING",
    },
    stage: {
      type: String,
      default: "MEASURING",
      trim: true,
    },
    stageIndex: {
      type: Number,
      default: 0,
      min: 0,
    },
    estCompletion: {
      type: String,
      default: "IN PROGRESS",
      trim: true,
    },
    category: {
      type: String,
      enum: ["active", "archive", "drafts"],
      default: "active",
    },
    tailorNotificationRead: {
      type: Boolean,
      default: false,
    },
    userNotificationRead: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
