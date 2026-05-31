export const api = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:3000${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err: any = new Error(body.message || "API error");
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
};
