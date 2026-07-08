import api from "../api/axios";

export const createOrder = async (payload) => {
  try {
    const res = await api.post("/api/orders", payload);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Order save failed");
  }
};

export const getUserOrders = async () => {
  try {
    const res = await api.get("/api/orders/mine");
    return Array.isArray(res.data.orders) ? res.data.orders : [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch orders");
  }
};

export const getTailorOrders = async () => {
  try {
    const res = await api.get("/api/orders/tailor");
    return Array.isArray(res.data.orders) ? res.data.orders : [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch tailor orders");
  }
};

export const completeTailorOrder = async (orderId) => {
  try {
    const res = await api.patch(`/api/orders/${orderId}/status`);
    return res.data.order;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update order status");
  }
};

export const acceptTailorOrder = async (orderId) => {
  try {
    const res = await api.patch(`/api/orders/${orderId}/accept`);
    return res.data.order;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to accept order");
  }
};

export const getTailorNotifications = async () => {
  try {
    const res = await api.get("/api/orders/tailor/notifications");
    return Array.isArray(res.data.notifications) ? res.data.notifications : [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch notifications");
  }
};

export const markTailorNotificationsRead = async () => {
  try {
    const res = await api.patch("/api/orders/tailor/notifications/read");
    return Array.isArray(res.data.notifications) ? res.data.notifications : [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update notifications");
  }
};
