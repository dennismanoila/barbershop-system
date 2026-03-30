import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useLocation } from "react-router-dom";

export default function Appointments() {
  const token = localStorage.getItem("token");

  let user: any = null;

  if (token) {
    user = JSON.parse(atob(token.split(".")[1]));
  }
  const [appointments, setAppointments] = useState([]);
  const location = useLocation();
  const load = async () => {
    const res = await api("/appointments");
    console.log("FRONTEND APPOINTMENTS PAGE -> response:", res);
    setAppointments(res);
  };

  useEffect(() => {
    load();
  }, [location]);

  const confirm = async (id: number) => {
    await api(`/appointments/${id}/confirm`, {
      method: "PATCH",
    });

    alert("Confirmed!");
    load();
  };

  return (
    <div>
      <h2>My Appointments</h2>

      {appointments.map((a: any) => (
        <div key={a.id}>
          {new Date(a.date).toLocaleString()} | {a.status}
          {a.status === "PENDING" &&
            (user?.role === "BARBER" || user?.role === "ADMIN") && (
              <button onClick={() => confirm(a.id)}>Confirm</button>
            )}
        </div>
      ))}
    </div>
  );
}
