import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useLocation } from "react-router-dom";

export default function BarberDashboard() {
  const [appointments, setAppointments] = useState([]);
  const location = useLocation();
  const token = localStorage.getItem("token");

  let user: any = null;
  if (token) {
    user = JSON.parse(atob(token.split(".")[1]));
  }

  console.log("FRONTEND BARBER DASHBOARD -> decoded user:", user);

  const load = async () => {
    const res = await api("/appointments");
    console.log("FRONTEND BARBER DASHBOARD -> response:", res);
    setAppointments(res);
  };

  useEffect(() => {
    load();
  }, [location]);

  const confirm = async (id: number) => {
    await api(`/appointments/${id}/confirm`, {
      method: "PATCH",
    });

    load();
  };

  // 🔥 protecție UI
  if (user?.role !== "BARBER") {
    return <p>Access denied</p>;
  }

  return (
    <div>
      <h2>Barber Dashboard</h2>

      {appointments.length === 0 && <p>No appointments</p>}

      {appointments.map((a: any) => (
        <div key={a.id} style={{ marginBottom: "10px" }}>
          <strong>{new Date(a.date).toLocaleString()}</strong>
          <div>Status: {a.status}</div>

          {a.status === "PENDING" && (
            <button onClick={() => confirm(a.id)}>Confirm</button>
          )}
        </div>
      ))}
    </div>
  );
}
