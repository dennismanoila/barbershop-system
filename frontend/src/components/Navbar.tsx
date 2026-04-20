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
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">
        ✂️ Barbershop
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
  );
}

export default Navbar;
