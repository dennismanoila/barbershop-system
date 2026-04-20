import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    window.dispatchEvent(new Event("storage"));
    navigate("/services");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ width: "360px", borderRadius: "16px" }}
      >
        <h3 className="text-center mb-4">Welcome Back</h3>

        <form onSubmit={handleLogin}>
          <input
            placeholder="Email"
            className="form-control mb-3"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-dark w-100 mb-3">Login</button>
        </form>

        <div className="text-center">
          <small>
            Don’t have an account? <a href="/register">Create one</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
