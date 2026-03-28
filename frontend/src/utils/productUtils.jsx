import { authFetch } from "./authFetch";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const parseResponse = async (res) => {
  const rawResponse = await res.text();

  try {
    return rawResponse ? JSON.parse(rawResponse) : {};
  } catch {
    return { message: rawResponse || "Unexpected server response" };
  }
};

export const createProduct = async (productData) => {
  const res = await authFetch(`${apiBaseUrl}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Product save failed");
  }

  return data;
};

export const getProducts = async () => {
  const res = await authFetch(`${apiBaseUrl}/api/products`);
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data.products || [];
};

export const getMyProducts = async () => {
  const res = await authFetch(`${apiBaseUrl}/api/products/mine`);
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch tailor products");
  }

  return data.products || [];
};
