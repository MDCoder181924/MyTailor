const apiBaseUrl = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location && window.location.hostname && window.location.hostname.includes("vercel.app") ? "https://my-tailor-backend.vercel.app" : "http://localhost:5000");

export const authFetch = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
    credentials: "include"
  });

  if (res.status === 401) {
    const refreshRes = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });

    if (refreshRes.ok) {
      await refreshRes.json();
    }

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
      credentials: "include"
    });
  }

  return res;
};
