import { useEffect, useState } from "react";
import { api } from "../api/client";
import Calendar from "../components/Calendar";

type Appointment = {
  id: number;
  date: string;
  status: string;
  createdAt: string;
  service: { name: string; durationMinutes: number };
  user: { id: number; email: string; firstName: string | null; lastName: string | null };
};

function getTimeLeft(createdAt: string): string {
  const expiresAt = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000;
  const ms = expiresAt - Date.now();
  if (ms <= 0) return "Expiring soon";
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m left`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function clientName(user: { firstName: string | null; lastName: string | null; email: string }): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || user.email;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ro-RO", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

const today = new Date().toISOString().split("T")[0];

export default function BarberDashboard() {
  const [tab, setTab] = useState<"calendar" | "pending">("calendar");
  const [calendarDate, setCalendarDate] = useState(today);
  const [calendarAppts, setCalendarAppts] = useState<Appointment[]>([]);
  const [pendingAppts, setPendingAppts] = useState<Appointment[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);

  const loadCalendar = async (date: string) => {
    setLoadingCalendar(true);
    try {
      const data = await api(`/barber/calendar?date=${date}`);
      setCalendarAppts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCalendar(false);
    }
  };

  const loadPending = async () => {
    setLoadingPending(true);
    try {
      const data = await api("/barber/pending");
      setPendingAppts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => { loadCalendar(calendarDate); }, [calendarDate]);
  useEffect(() => { if (tab === "pending") loadPending(); }, [tab]);

  const confirm = async (id: number) => {
    try {
      await api(`/appointments/${id}/confirm`, { method: "PATCH" });
      setPendingAppts((prev) => prev.filter((a) => a.id !== id));
      loadCalendar(calendarDate);
    } catch (err) {
      console.error(err);
    }
  };

  const cancel = async (id: number, label = "Cancel") => {
    if (!confirm(`${label} this appointment?`)) return;
    try {
      await api(`/appointments/${id}/cancel`, { method: "PATCH" });
      setPendingAppts((prev) => prev.filter((a) => a.id !== id));
      loadCalendar(calendarDate);
    } catch (err: any) {
      alert(err.message || "Failed to cancel appointment.");
    }
  };

  const pendingCount = pendingAppts.length;

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
          margin-bottom: 40px;
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

        .dash-tabs {
          display: flex;
          gap: 4px;
          max-width: 700px;
          margin: 0 auto 32px auto;
          background: #ededeb;
          padding: 4px;
          border-radius: 14px;
        }

        .dash-tab {
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .dash-tab.active {
          background: #fff;
          color: #111;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .dash-tab-badge {
          background: #b07d00;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 20px;
          line-height: 1.6;
        }

        /* Calendar tab */
        .cal-day-label {
          max-width: 700px;
          margin: 0 auto 16px auto;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
        }

        .cal-empty {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px;
          color: #ccc;
          font-size: 0.95rem;
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .cal-list {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cal-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .cal-card.pending-card {
          border-left: 4px solid #f0d080;
        }

        .cal-card.confirmed-card {
          border-left: 4px solid #b7e4c7;
        }

        .cal-time-block {
          text-align: center;
          min-width: 56px;
        }

        .cal-time {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #111;
          line-height: 1;
        }

        .cal-duration {
          font-size: 0.72rem;
          color: #bbb;
          margin-top: 3px;
        }

        .cal-divider {
          width: 1px;
          height: 40px;
          background: #f0f0f0;
          flex-shrink: 0;
        }

        .cal-info {
          flex: 1;
        }

        .cal-service {
          font-weight: 500;
          color: #111;
          font-size: 0.95rem;
          margin-bottom: 3px;
        }

        .cal-client {
          font-size: 0.82rem;
          color: #999;
        }

        .badge-pending {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 500;
          background: #fff8e6;
          color: #b07d00;
          border: 1px solid #f0d080;
          white-space: nowrap;
        }

        .badge-confirmed {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 500;
          background: #f0faf4;
          color: #1a7f4b;
          border: 1px solid #b7e4c7;
          white-space: nowrap;
        }

        /* Pending tab */
        .pending-list {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pending-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          border-left: 4px solid #f0d080;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .pending-info { flex: 1; }

        .pending-service {
          font-weight: 500;
          color: #111;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .pending-meta {
          font-size: 0.82rem;
          color: #999;
          margin-bottom: 4px;
        }

        .pending-expiry {
          font-size: 0.78rem;
          color: #c8a400;
          font-weight: 500;
        }

        .pending-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        .confirm-btn {
          padding: 9px 20px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          white-space: nowrap;
        }

        .confirm-btn:hover { background: #333; }
        .confirm-btn:active { transform: scale(0.97); }

        .decline-btn {
          padding: 9px 20px;
          background: #fef2f2;
          color: #c0392b;
          border: 1px solid #fcc;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }

        .decline-btn:hover { background: #c0392b; color: #fff; }

        .cal-cancel-btn {
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
          white-space: nowrap;
          flex-shrink: 0;
        }

        .cal-cancel-btn:hover { background: #c0392b; color: #fff; }

        .pending-empty {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px;
          color: #ccc;
          font-size: 0.95rem;
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .dash-loading {
          text-align: center;
          color: #bbb;
          padding: 60px 0;
          font-size: 0.9rem;
        }

        @media (max-width: 640px) {
          .dash-page { padding: 36px 16px; }
          .dash-title { font-size: 2rem; }
          .cal-card, .pending-card { flex-wrap: wrap; gap: 12px; }
          .pending-actions { width: 100%; flex-direction: row; justify-content: space-between; align-items: center; }
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-header">
          <p className="dash-eyebrow">Manage your day</p>
          <h1 className="dash-title">Barber Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          <button
            className={`dash-tab${tab === "calendar" ? " active" : ""}`}
            onClick={() => setTab("calendar")}
          >
            📅 Calendar
          </button>
          <button
            className={`dash-tab${tab === "pending" ? " active" : ""}`}
            onClick={() => setTab("pending")}
          >
            ⏳ Pending Requests
            {pendingCount > 0 && (
              <span className="dash-tab-badge">{pendingCount}</span>
            )}
          </button>
        </div>

        {/* Calendar tab */}
        {tab === "calendar" && (
          <>
            <div style={{ maxWidth: 700, margin: "0 auto 8px auto" }}>
              <Calendar
                value={calendarDate}
                onChange={setCalendarDate}
              />
            </div>

            <div className="cal-day-label">
              {formatDate(calendarDate + "T12:00:00")}
            </div>

            {loadingCalendar ? (
              <div className="dash-loading">Loading...</div>
            ) : calendarAppts.length === 0 ? (
              <div className="cal-empty">No appointments for this day.</div>
            ) : (
              <div className="cal-list">
                {calendarAppts.map((a) => (
                  <div
                    key={a.id}
                    className={`cal-card ${a.status === "PENDING" ? "pending-card" : "confirmed-card"}`}
                  >
                    <div className="cal-time-block">
                      <div className="cal-time">{formatTime(a.date)}</div>
                      <div className="cal-duration">{a.service.durationMinutes} min</div>
                    </div>
                    <div className="cal-divider" />
                    <div className="cal-info">
                      <div className="cal-service">{a.service.name}</div>
                      <div className="cal-client">{clientName(a.user)}</div>
                    </div>
                    <span className={a.status === "PENDING" ? "badge-pending" : "badge-confirmed"}>
                      {a.status === "PENDING" ? "Pending" : "Confirmed"}
                    </span>
                    <button
                      className="cal-cancel-btn"
                      onClick={() => cancel(a.id, "Cancel")}
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pending tab */}
        {tab === "pending" && (
          <>
            {loadingPending ? (
              <div className="dash-loading">Loading...</div>
            ) : pendingAppts.length === 0 ? (
              <div className="pending-empty">No pending requests.</div>
            ) : (
              <div className="pending-list">
                {pendingAppts.map((a) => (
                  <div key={a.id} className="pending-card">
                    <div className="pending-info">
                      <div className="pending-service">{a.service.name}</div>
                      <div className="pending-meta">
                        {clientName(a.user)} · {formatDate(a.date)} at {formatTime(a.date)}
                      </div>
                      <div className="pending-expiry">
                        ⏱ {getTimeLeft(a.createdAt)}
                      </div>
                    </div>
                    <div className="pending-actions">
                      <button className="confirm-btn" onClick={() => confirm(a.id)}>
                        Confirm
                      </button>
                      <button className="decline-btn" onClick={() => cancel(a.id, "Decline")}>
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
