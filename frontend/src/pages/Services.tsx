import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Services() {
  type Service = {
    id: number;
    name: string;
    durationMinutes: number;
    price: number;
  };

  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api("/services");

    // 🔥 eliminăm duplicatele după id
    const unique: Service[] = Array.from(
      new Map(res.map((s: Service) => [s.id, s])).values(),
    ) as Service[];
    setServices(unique);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Services</h2>

      <div className="row">
        {services.map((s: any) => (
          <div key={s.id} className="col-md-4 mb-3">
            <div className="card shadow-sm p-3">
              <h5>{s.name}</h5>
              <p>{s.durationMinutes} min</p>
              <p className="fw-bold">{s.price} RON</p>

              <button
                className="btn btn-dark w-100"
                onClick={() => {
                  console.log("CLICK BOOK", s.id);
                  navigate(`/booking?serviceId=${s.id}`);
                }}
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
