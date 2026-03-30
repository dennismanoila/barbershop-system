import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const loadUser = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    // 🔥 ascultă schimbările de storage
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    loadUser();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span
        className="navbar-brand"
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (user?.role === "CLIENT") navigate("/services");
          if (user?.role === "BARBER") navigate("/barber");
          if (user?.role === "ADMIN") navigate("/admin");
        }}
      >
        Barbershop
      </span>

      <div className="d-flex gap-2">
        {user?.role === "CLIENT" && (
          <>
            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/services")}
            >
              Services
            </button>

            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/appointments")}
            >
              My Appointments
            </button>
          </>
        )}

        {user?.role === "BARBER" && (
          <button
            className="btn btn-outline-light"
            onClick={() => navigate("/barber")}
          >
            Dashboard
          </button>
        )}

        {user?.role === "ADMIN" && (
          <button
            className="btn btn-outline-light"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </button>
        )}

        {user && (
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
