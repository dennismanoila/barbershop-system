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
    throw new Error("API error");
  }

  return res.json();
};
