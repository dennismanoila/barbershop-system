import { useEffect, useState } from "react";

export default function BarberDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);

  const loadAppointments = async () => {
    const res = await fetch("http://localhost:3000/appointments", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();

    const sorted = data.sort((a: any, b: any) => {
      if (a.status === b.status) return 0;
      if (a.status === "PENDING") return -1;
      return 1;
    });

    setAppointments(sorted);
  };

  const confirm = async (id: number) => {
    await fetch(`http://localhost:3000/appointments/${id}/confirm`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "CONFIRMED" } : a)),
    );
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className="page-container">
      <h2 className="section-title">Barber Dashboard</h2>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.client?.email || "mama ta"}</td>
                  <td>{a.service?.name}</td>
                  <td>{new Date(a.date).toLocaleString()}</td>

                  <td>
                    <span
                      className={`badge ${
                        a.status === "PENDING"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td>
                    {a.status === "PENDING" && (
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => confirm(a.id)}
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
