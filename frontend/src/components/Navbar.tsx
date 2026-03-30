import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const loadAuth = () => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");

    setToken(t);
    setRole(r ? r.toLowerCase() : null);
  };

  useEffect(() => {
    loadAuth();

    // 🔥 ascultăm schimbări în localStorage (IMPORTANT)
    window.addEventListener("storage", loadAuth);

    return () => {
      window.removeEventListener("storage", loadAuth);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    loadAuth();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">
        Barbershop
      </Link>

      <div className="ms-auto d-flex align-items-center gap-3">
        {token && role === "client" && (
          <>
            <Link className="nav-link text-white" to="/services">
              Services
            </Link>

            <Link className="nav-link text-white" to="/appointments">
              My Appointments
            </Link>
          </>
        )}

        {token && role === "barber" && (
          <Link className="nav-link text-white" to="/barber">
            Dashboard
          </Link>
        )}

        {!token && (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/login">
              Login
            </Link>

            <Link className="btn btn-light btn-sm" to="/register">
              Register
            </Link>
          </>
        )}

        {token && (
          <button className="btn btn-outline-light btn-sm" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
