import api from "../api/axios";

const TAILOR_CACHE_TTL = 30 * 1000;

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

let tailorsCache = getStoredCache("tailors_cache");
let tailorsCacheTime = Number(sessionStorage.getItem("tailors_cache_time")) || 0;
let tailorsRequest = null;

const tailorDetailCache = getStoredCache("tailor_detail_cache") || {};

export const getTailors = async (options = {}) => {
  const { forceRefresh = false } = options;
  const now = Date.now();

  if (
    !forceRefresh &&
    tailorsCache &&
    now - tailorsCacheTime < TAILOR_CACHE_TTL
  ) {
    return tailorsCache;
  }

  if (!forceRefresh && tailorsRequest) {
    return tailorsRequest;
  }

  tailorsRequest = (async () => {
    try {
      const res = await api.get("/api/tailor");
      const tailors = res.data.tailors || [];
      tailorsCache = tailors;
      tailorsCacheTime = Date.now();
      setStoredCache("tailors_cache", tailors);
      sessionStorage.setItem("tailors_cache_time", tailorsCacheTime.toString());
      return tailors;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch tailors");
    }
  })();

  try {
    return await tailorsRequest;
  } finally {
    tailorsRequest = null;
  }
};

export const getTailorById = async (tailorId, options = {}) => {
  const { forceRefresh = false } = options;
  const now = Date.now();
  const cached = tailorDetailCache[tailorId];

  if (!forceRefresh && cached && now - cached.time < TAILOR_CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await api.get(`/api/tailor/${tailorId}`);
    const tailor = res.data.tailor || null;
    if (tailor) {
      tailorDetailCache[tailorId] = {
        data: tailor,
        time: Date.now(),
      };
      setStoredCache("tailor_detail_cache", tailorDetailCache);
    }
    return tailor;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch tailor");
  }
};

export const getTailorReviews = async (tailorId) => {
  try {
    const res = await api.get(`/api/tailor/${tailorId}/reviews`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch reviews");
  }
};
