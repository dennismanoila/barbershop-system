import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Service = {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
};

const SERVICE_ICONS: Record<string, string> = {
  default: "✂️",
  haircut: "✂️",
  beard: "🪒",
  shave: "🪒",
  color: "🎨",
  wash: "💧",
  trim: "✂️",
};

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const key of Object.keys(SERVICE_ICONS)) {
    if (lower.includes(key)) return SERVICE_ICONS[key];
  }
  return SERVICE_ICONS.default;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/services")
      .then((res) => res.json())
      .then(setServices)
      .catch((err) => console.error("Failed to load services", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .services-page {
          min-height: calc(100vh - 56px);
          background: #f7f6f3;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 24px;
        }

        .services-header {
          text-align: center;
          margin-bottom: 52px;
        }

        .services-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 10px;
          font-family: 'DM Sans', sans-serif;
        }

        .services-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 700;
          color: #111;
          margin: 0;
          line-height: 1.2;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .service-card {
          background: #fff;
          border-radius: 20px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
        }

        .service-icon {
          font-size: 2rem;
          margin-bottom: 16px;
          display: block;
        }

        .service-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #111;
          margin-bottom: 8px;
        }

        .service-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .service-duration {
          font-size: 0.8rem;
          color: #999;
          background: #f5f5f5;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .service-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111;
        }

        .service-book-btn {
          margin-top: auto;
          padding: 12px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .service-book-btn:hover {
          background: #333;
        }

        .service-book-btn:active {
          transform: scale(0.99);
        }

        .services-empty {
          text-align: center;
          color: #aaa;
          padding: 80px 0;
          font-size: 0.95rem;
        }

        .services-loading {
          text-align: center;
          color: #bbb;
          padding: 80px 0;
          font-size: 0.95rem;
        }
      `}</style>

      <div className="services-page">
        <div className="services-header">
          <p className="services-eyebrow">What we offer</p>
          <h1 className="services-title">Our Services</h1>
        </div>

        {loading ? (
          <div className="services-loading">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="services-empty">
            No services available at the moment.
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div className="service-card" key={service.id}>
                <span className="service-icon">{getIcon(service.name)}</span>
                <div className="service-name">{service.name}</div>
                <div className="service-meta">
                  <span className="service-duration">
                    ⏱ {service.durationMinutes} min
                  </span>
                  <span className="service-price">{service.price} RON</span>
                </div>
                <button
                  className="service-book-btn"
                  onClick={() => navigate(`/booking?serviceId=${service.id}`)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
