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

  useEffect(() => {
    api("/barbers").then(setBarbers);
  }, []);

  const loadAvailability = async () => {
    const res = await api(`/availability?date=${date}`);
    console.log("SLOTS: ", res);
    setSlots(res);
  };

  const book = async (time: string) => {
    console.log("BOOK FUNCTION CALLED");
    try {
      if (!date) {
        alert("Select a date first");
        return;
      }

      const [hour, minute] = time.split(":");
      const formattedTime = `${hour.padStart(2, "0")}:${minute}`;

      const fullDate = new Date(`${date}T${formattedTime}:00`);

      console.log("FIXED DATE:", fullDate);

      const res = await api("/appointments", {
        method: "POST",
        body: JSON.stringify({
          serviceId: Number(serviceId),
          date: fullDate,
          barberId: selectedBarber || undefined,
        }),
      });

      alert("Booked!");
    } catch (err) {
      console.error("BOOK ERROR:", err);
    }
  };

  return (
    <div>
      <h2>Booking</h2>

      <h3>Select Barber (optional)</h3>
      <select onChange={(e) => setSelectedBarber(Number(e.target.value))}>
        <option value="">Any</option>
        {barbers.map((b: any) => (
          <option key={b.id} value={b.id}>
            {b.email}
          </option>
        ))}
      </select>

      <h3>Select Date</h3>
      <input type="date" onChange={(e) => setDate(e.target.value)} />

      <button onClick={loadAvailability}>Check Availability</button>

      <h3>Available Slots</h3>
      {slots.map((slot: any, i) => (
        <div key={i}>
          {slot.time} → {slot.availableBarbers} available
          <button
            disabled={slot.availableBarbers === 0}
            onClick={() => book(slot.time)}
          >
            {slot.availableBarbers === 0 ? "Full" : "Book"}
          </button>
        </div>
      ))}
    </div>
  );
}
