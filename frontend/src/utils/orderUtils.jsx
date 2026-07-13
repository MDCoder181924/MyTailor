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

export const shipTailorOrder = async (orderId) => {
  try {
    const res = await api.patch(`/api/orders/${orderId}/ship`);
    return res.data.order;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to ship order");
  }
};

export const payTailorOrder = async (orderId) => {
  try {
    const res = await api.patch(`/api/orders/${orderId}/pay`);
    return res.data.order;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to mark order as paid");
  }
};

export const collectOrder = async (orderId) => {
  try {
    const res = await api.patch(`/api/orders/${orderId}/collect`);
    return res.data.order;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to collect order");
  }
};

export const startTailorWork = async (orderId) => {
  try {
    const res = await api.patch(`/api/orders/${orderId}/start-work`);
    return res.data.order;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to start work");
  }
};

export const cancelUserOrder = async (orderId, { cancellationReason, cancellationDetails }) => {
  try {
    const res = await api.patch(`/api/orders/${orderId}/cancel`, { cancellationReason, cancellationDetails });
    return res.data.order;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to cancel order");
  }
};

export const submitOrderReview = async (orderId, { rating, title, comment }) => {
  try {
    const res = await api.post(`/api/orders/${orderId}/review`, { rating, title, comment });
    return res.data.review;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to submit review");
  }
};
