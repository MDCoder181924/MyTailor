import api from "../api/axios";

const PRODUCT_CACHE_TTL = 30 * 1000;
let productsCache = null;
let productsCacheTime = 0;
let productsRequest = null;

export const createProduct = async (productData) => {
  try {
    const res = await api.post("/api/products", productData);
    productsCache = null;
    productsCacheTime = 0;
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Product save failed");
  }
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
    try {
      const res = await api.get("/api/products");
      const products = res.data.products || [];
      productsCache = products;
      productsCacheTime = Date.now();
      return products;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch products");
    }
  })();

  try {
    return await productsRequest;
  } finally {
    productsRequest = null;
  }
};

export const getMyProducts = async () => {
  try {
    const res = await api.get("/api/products/mine");
    return res.data.products || [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch tailor products");
  }
};

export const getProductsByTailorId = async (tailorId) => {
  try {
    const res = await api.get(`/api/products/tailor/${tailorId}`);
    return res.data.products || [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch tailor products");
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const res = await api.put(`/api/products/${productId}`, productData);
    productsCache = null;
    productsCacheTime = 0;
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Product update failed");
  }
};

export const deleteProduct = async (productId) => {
  try {
    const res = await api.delete(`/api/products/${productId}`);
    productsCache = null;
    productsCacheTime = 0;
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Product deletion failed");
  }
};

