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
