import { useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/services")
      .then((res) => res.json())
      .then(setServices);
  }, []);

  return (
    <div className="page-container">
      <h2 className="section-title">Services</h2>

      <div className="row justify-content-center g-4">
        {services.map((service) => (
          <div className="col-md-5 col-lg-4" key={service.id}>
            <div className="card shadow-sm border-0 p-3 h-100">
              <h5>{service.name}</h5>

              <p className="text-muted mb-1">{service.durationMinutes} min</p>

              <p className="fw-bold mb-3">{service.price} RON</p>

              <button
                className="btn btn-dark"
                onClick={() =>
                  (window.location.href = `/booking?serviceId=${service.id}`)
                }
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
