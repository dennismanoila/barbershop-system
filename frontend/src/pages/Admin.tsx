import { useEffect, useState } from "react";
import { api } from "../api/client";

type User = {
  id: number;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
};

type Service = {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
};

const ROLES = ["CLIENT", "BARBER", "ADMIN"];

const myId = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.userId as number;
  } catch {
    return null;
  }
};

export default function Admin() {
  const [tab, setTab] = useState<"users" | "services">("users");

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Services
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const currentUserId = myId();

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api("/admin/users");
      setUsers(data);
    } catch {
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const data = await api("/services");
      setServices(data);
    } catch {
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => { loadUsers(); loadServices(); }, []);

  const changeRole = async (id: number, role: string) => {
    try {
      const updated = await api(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u)));
    } catch {
      alert("Failed to update role.");
    }
  };

  const toggleBan = async (user: User) => {
    try {
      const updated = await api(`/admin/users/${user.id}/ban`, {
        method: "PATCH",
        body: JSON.stringify({ banned: !user.banned }),
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, banned: updated.banned } : u)));
    } catch {
      alert("Failed to update ban status.");
    }
  };

  const addService = async () => {
    setAddError("");
    const duration = Number(newDuration);
    const price = Number(newPrice);

    if (!newName.trim()) return setAddError("Name is required.");
    if (!duration || duration <= 0) return setAddError("Please select a duration.");
    if (!price || price <= 0) return setAddError("Price must be positive.");

    setAdding(true);
    try {
      const created = await api("/services", {
        method: "POST",
        body: JSON.stringify({ name: newName.trim(), durationMinutes: duration, price }),
      });
      setServices((prev) => [...prev, created]);
      setNewName(""); setNewDuration(""); setNewPrice("");
    } catch {
      setAddError("Failed to add service.");
    } finally {
      setAdding(false);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    try {
      await api(`/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      if (err.status === 401 || err.status === 403) {
        alert("Session expired or insufficient permissions. Please log in again.");
      } else {
        alert(err.message || "Cannot delete service.");
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .admin-page {
          min-height: calc(100vh - 56px);
          background: #f7f6f3;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 24px;
        }

        .admin-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .admin-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 10px;
        }

        .admin-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 700;
          color: #111;
          margin: 0;
        }

        .admin-tabs {
          display: flex;
          gap: 4px;
          max-width: 800px;
          margin: 0 auto 32px auto;
          background: #ededeb;
          padding: 4px;
          border-radius: 14px;
        }

        .admin-tab {
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

        .admin-tab.active {
          background: #fff;
          color: #111;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .admin-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .admin-table thead {
          background: #fafafa;
          border-bottom: 1px solid #f0f0f0;
        }

        .admin-table th {
          padding: 13px 20px;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
        }

        .admin-table td {
          padding: 14px 20px;
          color: #333;
          border-bottom: 1px solid #f7f7f7;
          vertical-align: middle;
        }

        .admin-table tbody tr:last-child td { border-bottom: none; }
        .admin-table tbody tr:hover td { background: #fafaf9; }

        .role-select {
          padding: 6px 10px;
          border: 1.5px solid #e5e5e5;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #111;
          background: #fafafa;
          cursor: pointer;
          outline: none;
        }

        .role-select:focus { border-color: #111; }
        .role-select:disabled { opacity: 0.4; cursor: not-allowed; }

        .ban-btn {
          padding: 6px 14px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: background 0.15s;
        }

        .ban-btn.ban { background: #fef2f2; color: #c0392b; border: 1px solid #fcc; }
        .ban-btn.ban:hover { background: #c0392b; color: #fff; }
        .ban-btn.unban { background: #f0faf4; color: #1a7f4b; border: 1px solid #b7e4c7; }
        .ban-btn.unban:hover { background: #1a7f4b; color: #fff; }
        .ban-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .badge-banned {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 500;
          background: #fef2f2;
          color: #c0392b;
          border: 1px solid #fcc;
          margin-left: 8px;
        }

        /* Services */
        .add-form {
          max-width: 800px;
          margin: 0 auto 20px auto;
          background: #fff;
          border-radius: 20px;
          padding: 24px 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .add-form-title {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 14px;
        }

        .add-form-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .add-input {
          flex: 1;
          min-width: 120px;
          padding: 10px 14px;
          border: 1.5px solid #e5e5e5;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s;
        }

        .add-input:focus { border-color: #111; background: #fff; }

        .add-btn {
          padding: 10px 22px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }

        .add-btn:hover:not(:disabled) { background: #333; }
        .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .add-error {
          margin-top: 10px;
          font-size: 0.82rem;
          color: #c0392b;
        }

        .delete-btn {
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

        .delete-btn:hover { background: #c0392b; color: #fff; }

        .admin-loading {
          text-align: center;
          color: #bbb;
          padding: 60px 0;
          font-size: 0.9rem;
        }
      `}</style>

      <div className="admin-page">
        <div className="admin-header">
          <p className="admin-eyebrow">Administration</p>
          <h1 className="admin-title">Admin Panel</h1>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab${tab === "users" ? " active" : ""}`} onClick={() => setTab("users")}>
            👥 Users
          </button>
          <button className={`admin-tab${tab === "services" ? " active" : ""}`} onClick={() => setTab("services")}>
            ✂️ Services
          </button>
        </div>

        {/* Users tab */}
        {tab === "users" && (
          loadingUsers ? (
            <div className="admin-loading">Loading users...</div>
          ) : (
            <div className="admin-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Ban</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = u.id === currentUserId;
                    return (
                      <tr key={u.id}>
                        <td>
                          {u.email}
                          {u.banned && <span className="badge-banned">Banned</span>}
                        </td>
                        <td>
                          <select
                            className="role-select"
                            value={u.role}
                            disabled={isSelf}
                            onChange={(e) => changeRole(u.id, e.target.value)}
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString("ro-RO")}</td>
                        <td>
                          <button
                            className={`ban-btn ${u.banned ? "unban" : "ban"}`}
                            disabled={isSelf}
                            onClick={() => toggleBan(u)}
                          >
                            {u.banned ? "Unban" : "Ban"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Services tab */}
        {tab === "services" && (
          <>
            <div className="add-form">
              <div className="add-form-title">Add New Service</div>
              <div className="add-form-row">
                <input
                  className="add-input"
                  placeholder="Service name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <select
                  className="add-input"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                >
                  <option value="">Duration (min)</option>
                  {[30, 60, 90, 120, 150, 180].map((d) => (
                    <option key={d} value={d}>{d} min</option>
                  ))}
                </select>
                <input
                  className="add-input"
                  placeholder="Price (RON)"
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
                <button className="add-btn" onClick={addService} disabled={adding}>
                  {adding ? "Adding..." : "Add"}
                </button>
              </div>
              {addError && <div className="add-error">{addError}</div>}
            </div>

            {loadingServices ? (
              <div className="admin-loading">Loading services...</div>
            ) : (
              <div className="admin-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Duration</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.durationMinutes} min</td>
                        <td>{s.price} RON</td>
                        <td>
                          <button className="delete-btn" onClick={() => deleteService(s.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
