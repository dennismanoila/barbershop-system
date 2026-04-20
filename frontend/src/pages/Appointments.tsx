import { useEffect, useState } from "react";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/appointments", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        setAppointments(sorted);
      })
      .catch((err) => console.error("Failed to load appointments", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .appts-page {
          min-height: calc(100vh - 56px);
          background: #f7f6f3;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 24px;
        }

        .appts-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .appts-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 10px;
        }

        .appts-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 700;
          color: #111;
          margin: 0;
          line-height: 1.2;
        }

        .appts-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          max-width: 760px;
          margin: 0 auto;
          overflow: hidden;
        }

        .appts-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .appts-table thead {
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;
        }

        .appts-table th {
          padding: 14px 24px;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
        }

        .appts-table td {
          padding: 16px 24px;
          color: #333;
          border-bottom: 1px solid #f7f7f7;
        }

        .appts-table tbody tr:last-child td {
          border-bottom: none;
        }

        .appts-table tbody tr:hover td {
          background: #fafaf9;
        }

        .appts-service {
          font-weight: 500;
          color: #111;
        }

        .badge-pending {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          background: #fff8e6;
          color: #b07d00;
          border: 1px solid #f0d080;
        }

        .badge-confirmed {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          background: #f0faf4;
          color: #1a7f4b;
          border: 1px solid #b7e4c7;
        }

        .appts-empty {
          text-align: center;
          padding: 72px 24px;
          color: #bbb;
        }

        .appts-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: #ccc;
          margin-bottom: 8px;
        }

        .appts-empty-sub {
          font-size: 0.875rem;
          color: #ccc;
        }

        .appts-empty-sub a {
          color: #111;
          text-decoration: underline;
        }

        .appts-loading {
          text-align: center;
          color: #bbb;
          padding: 80px 0;
          font-size: 0.95rem;
        }
      `}</style>

      <div className="appts-page">
        <div className="appts-header">
          <p className="appts-eyebrow">Your schedule</p>
          <h1 className="appts-title">My Appointments</h1>
        </div>

        {loading ? (
          <div className="appts-loading">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="appts-card">
            <div className="appts-empty">
              <div className="appts-empty-title">No appointments yet.</div>
              <p className="appts-empty-sub">
                Go to <a href="/services">Services</a> to book your first
                appointment.
              </p>
            </div>
          </div>
        ) : (
          <div className="appts-card">
            <table className="appts-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td className="appts-service">{a.service?.name || "—"}</td>
                    <td>{new Date(a.date).toLocaleString()}</td>
                    <td>
                      {a.status === "PENDING" ? (
                        <span className="badge-pending">Pending</span>
                      ) : (
                        <span className="badge-confirmed">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
