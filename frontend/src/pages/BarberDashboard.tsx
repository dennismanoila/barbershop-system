import { useEffect, useState } from "react";

export default function BarberDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/appointments", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      const sorted = data.sort((a: any, b: any) => {
        if (a.status === b.status)
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (a.status === "PENDING") return -1;
        return 1;
      });
      setAppointments(sorted);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const confirm = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/appointments/${id}/confirm`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "CONFIRMED" } : a)),
      );
    } catch (err) {
      console.error("Failed to confirm appointment", err);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const pending = appointments.filter((a) => a.status === "PENDING");
  const confirmed = appointments.filter((a) => a.status === "CONFIRMED");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .dash-page {
          min-height: calc(100vh - 56px);
          background: #f7f6f3;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 24px;
        }

        .dash-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .dash-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 10px;
        }

        .dash-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 700;
          color: #111;
          margin: 0;
          line-height: 1.2;
        }

        .dash-section {
          max-width: 900px;
          margin: 0 auto 36px auto;
        }

        .dash-section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .dash-section-label span {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #aaa;
        }

        .dash-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e8e8;
        }

        .dash-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .dash-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .dash-table thead {
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;
        }

        .dash-table th {
          padding: 14px 24px;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
        }

        .dash-table td {
          padding: 16px 24px;
          color: #333;
          border-bottom: 1px solid #f7f7f7;
        }

        .dash-table tbody tr:last-child td {
          border-bottom: none;
        }

        .dash-table tbody tr:hover td {
          background: #fafaf9;
        }

        .dash-client {
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

        .dash-confirm-btn {
          padding: 8px 18px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .dash-confirm-btn:hover { background: #333; }
        .dash-confirm-btn:active { transform: scale(0.97); }

        .dash-empty {
          text-align: center;
          padding: 72px 24px;
          color: #bbb;
          max-width: 900px;
          margin: 0 auto;
        }

        .dash-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: #ccc;
          margin-bottom: 8px;
        }

        .dash-loading {
          text-align: center;
          color: #bbb;
          padding: 80px 0;
          font-size: 0.95rem;
        }

        .dash-stats {
          display: flex;
          gap: 16px;
          max-width: 900px;
          margin: 0 auto 40px auto;
        }

        .dash-stat {
          flex: 1;
          background: #fff;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .dash-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #111;
          line-height: 1;
          margin-bottom: 4px;
        }

        .dash-stat-label {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #aaa;
        }

        @media (max-width: 600px) {
          .dash-stats { flex-direction: column; }
          .dash-table th, .dash-table td { padding: 12px 16px; }
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-header">
          <p className="dash-eyebrow">Manage your day</p>
          <h1 className="dash-title">Barber Dashboard</h1>
        </div>

        {loading ? (
          <div className="dash-loading">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-title">No appointments yet.</div>
            <p style={{ fontSize: "0.875rem" }}>
              Your upcoming bookings will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="dash-stats">
              <div className="dash-stat">
                <div className="dash-stat-value">{appointments.length}</div>
                <div className="dash-stat-label">Total Appointments</div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-value" style={{ color: "#b07d00" }}>
                  {pending.length}
                </div>
                <div className="dash-stat-label">Pending</div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-value" style={{ color: "#1a7f4b" }}>
                  {confirmed.length}
                </div>
                <div className="dash-stat-label">Confirmed</div>
              </div>
            </div>

            {/* Pending */}
            {pending.length > 0 && (
              <div className="dash-section">
                <div className="dash-section-label">
                  <span>⏳ Pending</span>
                </div>
                <div className="dash-card">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map((a) => (
                        <tr key={a.id}>
                          <td className="dash-client">
                            {a.user?.email || "—"}
                          </td>
                          <td>{a.service?.name || "—"}</td>
                          <td>{new Date(a.date).toLocaleString()}</td>
                          <td>
                            <span className="badge-pending">Pending</span>
                          </td>
                          <td>
                            <button
                              className="dash-confirm-btn"
                              onClick={() => confirm(a.id)}
                            >
                              Confirm
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Confirmed */}
            {confirmed.length > 0 && (
              <div className="dash-section">
                <div className="dash-section-label">
                  <span>✅ Confirmed</span>
                </div>
                <div className="dash-card">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {confirmed.map((a) => (
                        <tr key={a.id}>
                          <td className="dash-client">
                            {a.user?.email || "—"}
                          </td>
                          <td>{a.service?.name || "—"}</td>
                          <td>{new Date(a.date).toLocaleString()}</td>
                          <td>
                            <span className="badge-confirmed">Confirmed</span>
                          </td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
