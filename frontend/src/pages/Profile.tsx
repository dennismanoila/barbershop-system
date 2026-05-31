import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/auth/me")
      .then((u) => {
        setEmail(u.email);
        setFirstName(u.firstName ?? "");
        setLastName(u.lastName ?? "");
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      setError("Enter at least a first or last name.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await api("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ firstName, lastName }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .profile-page {
          min-height: calc(100vh - 56px);
          background: #f7f6f3;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 24px;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .profile-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 10px;
        }

        .profile-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #111;
          margin: 0;
        }

        .profile-card {
          background: #fff;
          border-radius: 20px;
          padding: 36px 40px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          max-width: 480px;
          margin: 0 auto;
        }

        .profile-email {
          font-size: 0.85rem;
          color: #aaa;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .profile-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 7px;
        }

        .profile-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .profile-input {
          flex: 1;
          padding: 11px 14px;
          border: 1.5px solid #e5e5e5;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
          width: 100%;
        }

        .profile-input:focus {
          border-color: #111;
          background: #fff;
        }

        .profile-btn {
          width: 100%;
          padding: 13px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 4px;
        }

        .profile-btn:hover:not(:disabled) { background: #333; }
        .profile-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .profile-success {
          background: #f0faf4;
          color: #1a7f4b;
          border: 1px solid #b7e4c7;
          border-radius: 10px;
          padding: 11px 16px;
          font-size: 0.875rem;
          margin-top: 16px;
          text-align: center;
        }

        .profile-error {
          background: #fff0f0;
          color: #c0392b;
          border: 1px solid #f5c6cb;
          border-radius: 10px;
          padding: 11px 16px;
          font-size: 0.875rem;
          margin-bottom: 16px;
        }

        .profile-loading {
          text-align: center;
          color: #bbb;
          padding: 60px 0;
        }
      `}</style>

      <div className="profile-page">
        <div className="profile-header">
          <p className="profile-eyebrow">Account</p>
          <h1 className="profile-title">My Profile</h1>
        </div>

        <div className="profile-card">
          {loading ? (
            <div className="profile-loading">Loading...</div>
          ) : (
            <>
              <div className="profile-email">{email}</div>

              {error && <div className="profile-error">{error}</div>}

              <div style={{ marginBottom: 6 }}>
                <label className="profile-label">Name</label>
              </div>
              <div className="profile-row">
                <input
                  className="profile-input"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setSuccess(false); }}
                />
                <input
                  className="profile-input"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setSuccess(false); }}
                />
              </div>

              <button className="profile-btn" onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save Name"}
              </button>

              {success && (
                <div className="profile-success">Name updated successfully.</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
