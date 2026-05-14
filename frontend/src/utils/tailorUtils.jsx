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

export const getTailors = async () => {
  const res = await authFetch(`${apiBaseUrl}/api/tailor`);
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch tailors");
  }

  return data.tailors || [];
};

export const getTailorById = async (tailorId) => {
  const res = await authFetch(`${apiBaseUrl}/api/tailor/${tailorId}`);
  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch tailor");
  }

  return data.tailor || null;
};
