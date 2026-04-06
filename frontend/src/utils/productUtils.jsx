import { authFetch } from "./authFetch";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PRODUCT_CACHE_TTL = 30 * 1000;
let productsCache = null;
let productsCacheTime = 0;
let productsRequest = null;

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

  productsCache = null;
  productsCacheTime = 0;

  return data;
};

export const getProducts = async (options = {}) => {
  const { forceRefresh = false } = options;
  const now = Date.now();

  if (
    !forceRefresh &&
    productsCache &&
    now - productsCacheTime < PRODUCT_CACHE_TTL
  ) {
    return productsCache;
  }

  if (!forceRefresh && productsRequest) {
    return productsRequest;
  }

  productsRequest = (async () => {
    const res = await authFetch(`${apiBaseUrl}/api/products`);
    const data = await parseResponse(res);

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    const products = data.products || [];
    productsCache = products;
    productsCacheTime = Date.now();
    return products;
  })();

  try {
    return await productsRequest;
  } finally {
    productsRequest = null;
  }
};

export const getMyProducts = async () => {
  const res = await authFetch(`${apiBaseUrl}/api/products/mine`);
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch tailor products");
  }

  return data.products || [];
};

export const getProductsByTailorId = async (tailorId) => {
  const res = await authFetch(`${apiBaseUrl}/api/products/tailor/${tailorId}`);
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch tailor products");
  }

  return data.products || [];
};
