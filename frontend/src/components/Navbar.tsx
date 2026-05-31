import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const getAuth = () => ({
    token: localStorage.getItem("token"),
    role: (localStorage.getItem("role") ?? "").toLowerCase(),
  });

  const [auth, setAuth] = useState(getAuth);

  const refresh = () => setAuth(getAuth());

  useEffect(() => {
    refresh();

    window.addEventListener("authChange", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("authChange", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    refresh();
    navigate("/");
  };

  const { token, role } = auth;

  return (
    <>
      <style>{`
        .nav-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 576px) {
          .navbar { padding: 10px 16px !important; }
          .navbar-brand { font-size: 1rem; }
          .nav-inner { gap: 8px; width: 100%; margin-top: 6px; }
          .nav-inner .nav-link { font-size: 0.85rem; padding: 0; }
          .nav-inner .btn-sm { font-size: 0.8rem; padding: 4px 12px; }
        }
      `}</style>
      <nav className="navbar navbar-dark bg-dark px-4 flex-wrap">
        <Link className="navbar-brand fw-bold" to="/">
          ✂️ Barbershop
        </Link>

        <div className="nav-inner">
          {token && role === "client" && (
            <>
              <Link className="nav-link text-white" to="/services">
                Services
              </Link>
              <Link className="nav-link text-white" to="/appointments">
                Appointments
              </Link>
            </>
          )}

          {token && role === "barber" && (
            <Link className="nav-link text-white" to="/barber">
              Dashboard
            </Link>
          )}

          {token && role === "admin" && (
            <>
              <Link className="nav-link text-white" to="/services">
                Services
              </Link>
              <Link className="nav-link text-white" to="/admin">
                Admin Panel
              </Link>
            </>
          )}

          {!token && (
            <>
              <Link className="btn btn-outline-light btn-sm" to="/">
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
    </>
  );
}

export default Navbar;
