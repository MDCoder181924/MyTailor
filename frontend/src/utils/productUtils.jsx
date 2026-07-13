import api from "../api/axios";

const PRODUCT_CACHE_TTL = 30 * 1000;

const getStoredCache = (key) => {
  try {
    const val = sessionStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};

const setStoredCache = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

let productsCache = getStoredCache("products_cache");
let productsCacheTime = Number(sessionStorage.getItem("products_cache_time")) || 0;
let productsRequest = null;

const clearProductCache = () => {
  productsCache = null;
  productsCacheTime = 0;
  try {
    sessionStorage.removeItem("products_cache");
    sessionStorage.removeItem("products_cache_time");
  } catch {}
};

export const createProduct = async (productData) => {
  try {
    const res = await api.post("/api/products", productData);
    clearProductCache();
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
      setStoredCache("products_cache", products);
      sessionStorage.setItem("products_cache_time", productsCacheTime.toString());
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
    clearProductCache();
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Product update failed");
  }
};

export const deleteProduct = async (productId) => {
  try {
    const res = await api.delete(`/api/products/${productId}`);
    clearProductCache();
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Product deletion failed");
  }
};

