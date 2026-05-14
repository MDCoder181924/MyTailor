import { authFetch } from "./authFetch";

const apiBaseUrl = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location && window.location.hostname && window.location.hostname.includes("vercel.app") ? "https://my-tailor-backend.vercel.app" : "http://localhost:5000");

const parseResponse = async (res) => {
  const rawResponse = await res.text();

  try {
    return rawResponse ? JSON.parse(rawResponse) : {};
  } catch {
    return { message: rawResponse || "Unexpected server response" };
  }
};

export const createOrder = async (payload) => {
  const res = await authFetch(`${apiBaseUrl}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Order save failed");
  }

  return data;
};

export const getUserOrders = async () => {
  const res = await authFetch(`${apiBaseUrl}/api/orders/mine`);
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return Array.isArray(data.orders) ? data.orders : [];
};

export const getTailorOrders = async () => {
  const res = await authFetch(`${apiBaseUrl}/api/orders/tailor`);
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch tailor orders");
  }

  return Array.isArray(data.orders) ? data.orders : [];
};

export const completeTailorOrder = async (orderId) => {
  const res = await authFetch(`${apiBaseUrl}/api/orders/${orderId}/status`, {
    method: "PATCH",
  });
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to update order status");
  }

  return data.order;
};

export const getTailorNotifications = async () => {
  const res = await authFetch(`${apiBaseUrl}/api/orders/tailor/notifications`);
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return Array.isArray(data.notifications) ? data.notifications : [];
};

export const markTailorNotificationsRead = async () => {
  const res = await authFetch(`${apiBaseUrl}/api/orders/tailor/notifications/read`, {
    method: "PATCH",
  });
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to update notifications");
  }

  return Array.isArray(data.notifications) ? data.notifications : [];
};
