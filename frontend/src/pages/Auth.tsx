import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const res = await api(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (isLogin) {
        localStorage.setItem("token", res.token);

        const user = JSON.parse(atob(res.token.split(".")[1]));

        if (user.role === "CLIENT") navigate("/services");
        if (user.role === "BARBER") navigate("/barber");
        if (user.role === "ADMIN") navigate("/admin");
      } else {
        alert("Account created! Now login.");
        setIsLogin(true);
      }
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="auth-container shadow">
        <div className="auth-left">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

          <input
            className="form-control mb-2"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-dark w-100" onClick={handleSubmit}>
            {isLogin ? "Login" : "Register"}
          </button>
        </div>

        <div className="auth-right text-center text-white">
          <h3>{isLogin ? "New here?" : "Already have an account?"}</h3>

          <button
            className="btn btn-outline-light mt-3"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
