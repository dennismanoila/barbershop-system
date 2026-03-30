import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", res.token);

    // navigate("/services");
    if (res.token) {
      localStorage.setItem("token", res.token);

      const user = JSON.parse(atob(res.token.split(".")[1]));

      if (user.role === "CLIENT") navigate("/services");
      if (user.role === "BARBER") navigate("/barber");
      if (user.role === "ADMIN") navigate("/admin");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
