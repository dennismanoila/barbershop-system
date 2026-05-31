import { useEffect, useState } from "react";
import { api } from "../api/client";

function barberName(barber: { firstName: string | null; lastName: string | null; email: string } | null): string {
  if (!barber) return "—";
  const name = [barber.firstName, barber.lastName].filter(Boolean).join(" ");
  return name || barber.email;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");

  const load = () => {
    setLoading(true);
    api("/appointments")
      .then((data) => {
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        setAppointments(sorted);
      })
      .catch((err) => console.error("Failed to load appointments", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id: number) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await api(`/appointments/${id}/cancel`, { method: "PATCH" });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a)),
      );
    } catch (err: any) {
      alert(err.message || "Failed to cancel appointment.");
    }
  };

  const now = new Date();

  const upcoming = appointments.filter(
    (a) =>
      (a.status === "PENDING" || a.status === "CONFIRMED") &&
      new Date(a.date) >= now,
  );

  const history = appointments.filter(
    (a) =>
      a.status === "CANCELLED" ||
      a.status === "EXPIRED" ||
      new Date(a.date) < now,
  );

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
          margin-bottom: 40px;
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

        .appts-tabs {
          display: flex;
          gap: 4px;
          max-width: 820px;
          margin: 0 auto 32px auto;
          background: #ededeb;
          padding: 4px;
          border-radius: 14px;
        }

        .appts-tab {
          flex: 1;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #999;
          transition: background 0.15s, color 0.15s;
        }

        .appts-tab.active {
          background: #fff;
          color: #111;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .appts-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          max-width: 820px;
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
          vertical-align: middle;
        }

        .appts-table tbody tr:last-child td { border-bottom: none; }
        .appts-table tbody tr:hover td { background: #fafaf9; }

        .appts-service { font-weight: 500; color: #111; }

        .badge-pending {
          display: inline-block; padding: 4px 12px; border-radius: 20px;
          font-size: 0.75rem; font-weight: 500;
          background: #fff8e6; color: #b07d00; border: 1px solid #f0d080;
        }

        .badge-confirmed {
          display: inline-block; padding: 4px 12px; border-radius: 20px;
          font-size: 0.75rem; font-weight: 500;
          background: #f0faf4; color: #1a7f4b; border: 1px solid #b7e4c7;
        }

        .badge-cancelled {
          display: inline-block; padding: 4px 12px; border-radius: 20px;
          font-size: 0.75rem; font-weight: 500;
          background: #f7f7f7; color: #aaa; border: 1px solid #e5e5e5;
        }

        .badge-expired {
          display: inline-block; padding: 4px 12px; border-radius: 20px;
          font-size: 0.75rem; font-weight: 500;
          background: #fef2f2; color: #c0392b; border: 1px solid #fcc;
        }

        .badge-completed {
          display: inline-block; padding: 4px 12px; border-radius: 20px;
          font-size: 0.75rem; font-weight: 500;
          background: #f0f4ff; color: #3456a8; border: 1px solid #c5d3f5;
        }

        .cancel-btn {
          padding: 6px 14px;
          background: #fef2f2;
          color: #c0392b;
          border: 1px solid #fcc;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }

        .cancel-btn:hover { background: #c0392b; color: #fff; }

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

        .appts-empty-sub { font-size: 0.875rem; color: #ccc; }
        .appts-empty-sub a { color: #111; text-decoration: underline; }

        .appts-loading {
          text-align: center;
          color: #bbb;
          padding: 80px 0;
          font-size: 0.95rem;
        }

        @media (max-width: 640px) {
          .appts-page { padding: 36px 16px; }
          .appts-title { font-size: 2rem; }
          .appts-header { margin-bottom: 28px; }
          .appts-card { border-radius: 16px; }
          .appts-table thead { display: none; }
          .appts-table tbody tr {
            display: block; padding: 16px 20px;
            border-bottom: 1px solid #f0f0f0;
          }
          .appts-table tbody tr:last-child { border-bottom: none; }
          .appts-table tbody tr:hover td { background: transparent; }
          .appts-table td {
            display: flex; justify-content: space-between;
            align-items: center; padding: 5px 0; border: none; font-size: 0.875rem;
          }
          .appts-table td::before {
            content: attr(data-label);
            font-size: 0.72rem; font-weight: 500;
            text-transform: uppercase; letter-spacing: 0.08em;
            color: #aaa; flex-shrink: 0; margin-right: 12px;
          }
        }
      `}</style>

      <div className="appts-page">
        <div className="appts-header">
          <p className="appts-eyebrow">Your schedule</p>
          <h1 className="appts-title">My Appointments</h1>
        </div>

        <div className="appts-tabs">
          <button
            className={`appts-tab${tab === "upcoming" ? " active" : ""}`}
            onClick={() => setTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`appts-tab${tab === "history" ? " active" : ""}`}
            onClick={() => setTab("history")}
          >
            History
          </button>
        </div>

        {loading ? (
          <div className="appts-loading">Loading appointments...</div>
        ) : tab === "upcoming" ? (
          upcoming.length === 0 ? (
            <div className="appts-card">
              <div className="appts-empty">
                <div className="appts-empty-title">No upcoming appointments.</div>
                <p className="appts-empty-sub">
                  Go to <a href="/services">Services</a> to book your next appointment.
                </p>
              </div>
            </div>
          ) : (
            <div className="appts-card">
              <table className="appts-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Barber</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((a) => (
                    <tr key={a.id}>
                      <td data-label="Service" className="appts-service">{a.service?.name || "—"}</td>
                      <td data-label="Barber">{barberName(a.barber)}</td>
                      <td data-label="Date & Time">{new Date(a.date).toLocaleString("ro-RO")}</td>
                      <td data-label="Status">
                        {a.status === "PENDING" && <span className="badge-pending">Pending</span>}
                        {a.status === "CONFIRMED" && <span className="badge-confirmed">Confirmed</span>}
                      </td>
                      <td data-label="">
                        {a.status === "PENDING" && (
                          <button className="cancel-btn" onClick={() => cancel(a.id)}>
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          history.length === 0 ? (
            <div className="appts-card">
              <div className="appts-empty">
                <div className="appts-empty-title">No history yet.</div>
                <p className="appts-empty-sub">Past and cancelled appointments will appear here.</p>
              </div>
            </div>
          ) : (
            <div className="appts-card">
              <table className="appts-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Barber</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map((a) => (
                    <tr key={a.id}>
                      <td data-label="Service" className="appts-service">{a.service?.name || "—"}</td>
                      <td data-label="Barber">{barberName(a.barber)}</td>
                      <td data-label="Date & Time">{new Date(a.date).toLocaleString("ro-RO")}</td>
                      <td data-label="Status">
                        {a.status === "CANCELLED" && <span className="badge-cancelled">Cancelled</span>}
                        {a.status === "EXPIRED" && <span className="badge-expired">Expired</span>}
                        {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                          <span className="badge-completed">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </>
  );
}
