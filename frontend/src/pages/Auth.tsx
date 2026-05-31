import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api(endpoint, {
        method: "POST",
        body: JSON.stringify(
          isLogin ? { email, password } : { email, password, firstName, lastName }
        ),
      });

      if (isLogin) {
        const base64 = res.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const user = JSON.parse(atob(base64));
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", user.role.toLowerCase());
        window.dispatchEvent(new Event("authChange"));

        if (user.role === "CLIENT") navigate("/services");
        else if (user.role === "BARBER") navigate("/barber");
        else if (user.role === "ADMIN") navigate("/admin");
      } else {
        alert("Account created! You can now log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      if (isLogin && err?.message?.toLowerCase().includes("banned")) {
        setError("Your account has been banned.");
      } else {
        setError(
          isLogin
            ? "Invalid email or password."
            : "Registration failed. Try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0e0e0e;
          font-family: 'DM Sans', sans-serif;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .auth-root::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          border-radius: 50%;
          pointer-events: none;
        }

        .auth-root::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
          bottom: -80px;
          left: -80px;
          border-radius: 50%;
          pointer-events: none;
        }

        .auth-card {
          display: flex;
          width: 100%;
          max-width: 820px;
          min-height: 480px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
          position: relative;
          z-index: 1;
        }

        .auth-panel-left {
          flex: 1;
          background: #ffffff;
          padding: 52px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-panel-right {
          width: 300px;
          background: #111111;
          padding: 52px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          border-left: 1px solid #222;
          position: relative;
          overflow: hidden;
        }

        .auth-panel-right::before {
          content: '✂';
          position: absolute;
          font-size: 180px;
          opacity: 0.04;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-20deg);
          pointer-events: none;
        }

        .auth-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 12px;
        }

        .auth-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #111;
          margin: 0 0 6px 0;
          line-height: 1.2;
        }

        .auth-sub {
          color: #999;
          font-size: 0.875rem;
          margin-bottom: 28px;
        }

        .auth-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e5e5;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #111;
          background: #fafafa;
          margin-bottom: 14px;
          transition: border-color 0.2s;
          outline: none;
          box-sizing: border-box;
          display: block;
        }

        .auth-input:focus {
          border-color: #111;
          background: #fff;
        }

        .auth-btn-primary {
          width: 100%;
          padding: 13px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 4px;
        }

        .auth-btn-primary:hover:not(:disabled) { background: #333; }
        .auth-btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .auth-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-error {
          background: #fff0f0;
          color: #c0392b;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }

        .auth-right-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #ffffff;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }

        .auth-right-sub {
          color: #666;
          font-size: 0.82rem;
          line-height: 1.6;
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }

        .auth-btn-outline {
          padding: 11px 28px;
          background: transparent;
          color: #fff;
          border: 1.5px solid #444;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          z-index: 1;
        }

        .auth-btn-outline:hover {
          border-color: #888;
          background: rgba(255,255,255,0.04);
        }

        @media (max-width: 640px) {
          .auth-card { flex-direction: column; }
          .auth-panel-right { width: 100%; padding: 36px 32px; }
          .auth-panel-left { padding: 40px 32px; }
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-card">
          <div className="auth-panel-left">
            <div className="auth-logo">✂ Barbershop</div>
            <h1 className="auth-heading">
              {isLogin ? "Welcome back." : "Create account."}
            </h1>
            <p className="auth-sub">
              {isLogin
                ? "Sign in to manage your appointments."
                : "Join us and book your first appointment."}
            </p>

            {error && <div className="auth-error">{error}</div>}

            {!isLogin && (
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  className="auth-input"
                  style={{ marginBottom: 14 }}
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  className="auth-input"
                  style={{ marginBottom: 14 }}
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            )}

            <input
              className="auth-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            <button
              className="auth-btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </div>

          <div className="auth-panel-right">
            <h2 className="auth-right-heading">
              {isLogin ? "New here?" : "Have an account?"}
            </h2>
            <p className="auth-right-sub">
              {isLogin
                ? "Create an account and start booking your appointments online."
                : "Sign in to access your bookings and appointments."}
            </p>
            <button
              className="auth-btn-outline"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Register" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
