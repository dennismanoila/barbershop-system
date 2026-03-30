import { useEffect, useState } from "react";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/appointments", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then(setAppointments);
  }, []);

  return (
    <div className="page-container">
      <h2 className="section-title">My Appointments</h2>

      <div className="card p-4 shadow-sm">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
