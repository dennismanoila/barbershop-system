import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useSearchParams } from "react-router-dom";

export default function Booking() {
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [params] = useSearchParams();
  const serviceId = params.get("serviceId");
  const [loadingSlot, setLoadingSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [slotsLoaded, setSlotsLoaded] = useState(false);

  useEffect(() => {
    api("/barbers").then(setBarbers);
  }, []);

  const loadAvailability = async () => {
    if (!date) {
      alert("Please select a date first.");
      return;
    }
    setLoadingSlots(true);
    setSlotsLoaded(false);
    setSuccessMessage("");
    try {
      const res = await api(`/availability?date=${date}`);
      setSlots(res);
      setSlotsLoaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const book = async (time: string) => {
    try {
      setLoadingSlot(time);
      setSuccessMessage("");
      const [hour, minute] = time.split(":");
      const formattedTime = `${hour.padStart(2, "0")}:${minute}`;
      const fullDate = new Date(`${date}T${formattedTime}:00`);

      await api("/appointments", {
        method: "POST",
        body: JSON.stringify({
          serviceId: Number(serviceId),
          date: fullDate,
          barberId: selectedBarber || undefined,
        }),
      });

      setSuccessMessage(`Appointment booked for ${time}!`);
      loadAvailability();
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoadingSlot(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .booking-page {
          min-height: calc(100vh - 56px);
          background: #f7f6f3;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 24px;
        }

        .booking-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .booking-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 10px;
        }

        .booking-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 700;
          color: #111;
          margin: 0;
          line-height: 1.2;
        }

        .booking-card {
          background: #fff;
          border-radius: 20px;
          padding: 36px 40px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          max-width: 520px;
          margin: 0 auto 28px auto;
        }

        .booking-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 8px;
        }

        .booking-select,
        .booking-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e5e5;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #111;
          background: #fafafa;
          margin-bottom: 20px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
          appearance: auto;
        }

        .booking-select:focus,
        .booking-input:focus {
          border-color: #111;
          background: #fff;
        }

        .booking-btn {
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
          transition: background 0.2s, transform 0.1s;
        }

        .booking-btn:hover:not(:disabled) { background: #333; }
        .booking-btn:active:not(:disabled) { transform: scale(0.99); }
        .booking-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .booking-success {
          max-width: 520px;
          margin: 0 auto 24px auto;
          background: #f0faf4;
          color: #1a7f4b;
          border: 1px solid #b7e4c7;
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 0.9rem;
          text-align: center;
        }

        .slots-card {
          background: #fff;
          border-radius: 20px;
          padding: 36px 40px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          max-width: 520px;
          margin: 0 auto;
        }

        .slots-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: #111;
          margin-bottom: 20px;
        }

        .slots-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .slot-btn {
          padding: 9px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: 1.5px solid #111;
          background: #fff;
          color: #111;
          transition: background 0.15s, color 0.15s, transform 0.1s;
          min-width: 72px;
          text-align: center;
        }

        .slot-btn:hover:not(:disabled) {
          background: #111;
          color: #fff;
        }

        .slot-btn:active:not(:disabled) { transform: scale(0.97); }

        .slot-btn:disabled {
          border-color: #e0e0e0;
          background: #f5f5f5;
          color: #ccc;
          cursor: not-allowed;
        }

        .slot-btn.loading {
          background: #111;
          color: #fff;
        }

        .slots-hint {
          margin-top: 16px;
          font-size: 0.78rem;
          color: #bbb;
        }
      `}</style>

      <div className="booking-page">
        <div className="booking-header">
          <p className="booking-eyebrow">Reserve your spot</p>
          <h1 className="booking-title">Book Appointment</h1>
        </div>

        <div className="booking-card">
          <label className="booking-label">Barber</label>
          <select
            className="booking-select"
            onChange={(e) =>
              setSelectedBarber(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Any available barber</option>
            {barbers.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name || b.email}
              </option>
            ))}
          </select>

          <label className="booking-label">Date</label>
          <input
            type="date"
            className="booking-input"
            min={today}
            onChange={(e) => {
              setDate(e.target.value);
              setSlots([]);
              setSlotsLoaded(false);
              setSuccessMessage("");
            }}
          />

          <button
            className="booking-btn"
            onClick={loadAvailability}
            disabled={loadingSlots}
          >
            {loadingSlots ? "Checking..." : "Check Availability"}
          </button>
        </div>

        {successMessage && (
          <div className="booking-success">✅ {successMessage}</div>
        )}

        {slotsLoaded && (
          <div className="slots-card">
            <div className="slots-title">Available Slots</div>

            {slots.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                No slots available for this date.
              </p>
            ) : (
              <div className="slots-grid">
                {slots.map((slot: any, i) => {
                  const unavailable = slot.availableBarbers === 0;
                  const isLoading = loadingSlot === slot.time;
                  return (
                    <button
                      key={i}
                      disabled={unavailable || !!loadingSlot}
                      className={`slot-btn${isLoading ? " loading" : ""}`}
                      onClick={() => book(slot.time)}
                    >
                      {isLoading ? "..." : slot.time}
                    </button>
                  );
                })}
              </div>
            )}

            <p className="slots-hint">Grey slots are fully booked.</p>
          </div>
        )}
      </div>
    </>
  );
}
