import api from "../api/axios";

export const getTailors = async () => {
  try {
    const res = await api.get("/api/tailor");
    return res.data.tailors || [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch tailors");
  }
};

export const getTailorById = async (tailorId) => {
  try {
    const res = await api.get(`/api/tailor/${tailorId}`);
    return res.data.tailor || null;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch tailor");
  }
};
