const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const authFetch = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    credentials: "include"
  });

  if (res.status === 401) {
    await fetch(`${apiBaseUrl}/api/user/refresh`, {
      method: "POST",
      credentials: "include"
    });

    res = await fetch(url, {
      ...options,
      credentials: "include"
    });
  }

  return res;
};