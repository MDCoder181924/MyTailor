import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Website", "Tailor", "Order", "Other"],
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tailor",
      required: false,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    adminReply: {
      type: String,
      default: "",
      trim: true,
    },
    repliedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicket;
