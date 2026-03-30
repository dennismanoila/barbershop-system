import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useSearchParams } from "react-router-dom";

export default function Booking() {
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [params] = useSearchParams();
  const serviceId = params.get("serviceId");
  const [loadingSlot, setLoadingSlot] = useState<string | null>(null);

  useEffect(() => {
    api("/barbers").then(setBarbers);
  }, []);

  const loadAvailability = async () => {
    const res = await api(`/availability?date=${date}`);
    console.log("SLOTS: ", res);
    setSlots(res);
  };

  const book = async (time: string) => {
    try {
      setLoadingSlot(time);

      if (!date) {
        alert("Select a date first");
        return;
      }

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

      alert("Booked!");

      loadAvailability(); // refresh slots
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlot(null);
    }
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Book Appointment</h2>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm mb-4">
            <div className="mb-3">
              <label>Barber</label>
              <select
                className="form-control"
                onChange={(e) => setSelectedBarber(Number(e.target.value))}
              >
                <option value="">Any</option>
                {barbers.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Date</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button className="btn btn-dark" onClick={loadAvailability}>
              Check Availability
            </button>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Available Slots</h5>

            <div className="d-flex flex-wrap gap-2">
              {slots.map((slot: any, i) => (
                <button
                  key={i}
                  disabled={slot.availableBarbers === 0}
                  className={`btn ${
                    slot.availableBarbers === 0
                      ? "btn-secondary"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => book(slot.time)}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
