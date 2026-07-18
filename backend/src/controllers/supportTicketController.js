import SupportTicket from "../models/SupportTicket.js";

// Create a support ticket (open to guests and logged-in users)
export const createTicket = async (req, res) => {
  try {
    const { name, email, subject, category, tailor, order, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "Name, email, subject, and message are required" });
    }

    const ticketData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      category,
      message: message.trim(),
    };

    // If logged-in user, link their account
    if (req.user && req.user.role === "user") {
      ticketData.user = req.user.id;
    }

    if (category === "Tailor" && tailor) {
      ticketData.tailor = tailor;
    }

    if (category === "Order" && order) {
      ticketData.order = order;
    }

    const ticket = await SupportTicket.create(ticketData);

    res.status(201).json({
      message: "Support ticket registered successfully",
      ticket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tickets submitted by the logged-in user
export const getUserTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id })
      .populate("tailor", "tailorName tailorEmail shopName")
      .populate("order", "orderNo status price")
      .sort({ createdAt: -1 });

    res.json({
      message: "User support tickets fetched",
      tickets,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all tickets
export const adminGetAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("user", "userFullName userEmail")
      .populate("tailor", "tailorName tailorEmail shopName")
      .populate("order", "orderNo status price")
      .sort({ createdAt: -1 });

    res.json({
      message: "All support tickets fetched",
      tickets,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Reply to a ticket
export const adminReplyTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;

    if (!reply?.trim()) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.adminReply = reply.trim();
    ticket.status = status || "Resolved";
    ticket.repliedAt = new Date();

    await ticket.save();

    res.json({
      message: "Ticket replied successfully",
      ticket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
