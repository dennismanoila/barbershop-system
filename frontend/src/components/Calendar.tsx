import { useState } from "react";

type Props = {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
};

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toYMD(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function Calendar({ value, onChange, minDate }: Props) {
  const today = toYMD(new Date());

  const seed = value ? new Date(value + "T12:00:00") : new Date();
  const [view, setView] = useState({ year: seed.getFullYear(), month: seed.getMonth() });

  const prevMonth = () =>
    setView((v) =>
      v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }
    );

  const nextMonth = () =>
    setView((v) =>
      v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }
    );

  const firstDow = new Date(view.year, view.month, 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const getDateStr = (day: number) => {
    const m = String(view.month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${view.year}-${m}-${d}`;
  };

  return (
    <>
      <style>{`
        .cal-widget {
          background: #fff;
          border-radius: 14px;
          border: 1.5px solid #e5e5e5;
          overflow: hidden;
          user-select: none;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 20px;
        }
        .cal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 18px;
          border-bottom: 1px solid #f0f0f0;
        }
        .cal-nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 1.1rem;
          color: #555;
          transition: background 0.15s, color 0.15s;
          line-height: 1;
          font-family: 'DM Sans', sans-serif;
        }
        .cal-nav-btn:hover { background: #f0f0f0; color: #111; }
        .cal-month-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: #111;
        }
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          padding: 10px 12px 14px;
          gap: 2px;
        }
        .cal-dow {
          text-align: center;
          font-size: 0.65rem;
          font-weight: 500;
          color: #bbb;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 0 8px;
          font-family: 'DM Sans', sans-serif;
        }
        .cal-day {
          text-align: center;
          padding: 7px 2px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          cursor: pointer;
          color: #111;
          transition: background 0.12s, color 0.12s;
          position: relative;
          line-height: 1.4;
        }
        .cal-day-empty { cursor: default; }
        .cal-day-disabled { color: #ddd; cursor: not-allowed; }
        .cal-day:hover:not(.cal-day-disabled):not(.cal-day-selected):not(.cal-day-empty) {
          background: #f0f0f0;
        }
        .cal-day-today:not(.cal-day-selected) { font-weight: 700; }
        .cal-day-today:not(.cal-day-selected)::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #111;
        }
        .cal-day-selected {
          background: #111 !important;
          color: #fff !important;
          font-weight: 600;
        }
      `}</style>
      <div className="cal-widget">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <span className="cal-month-label">{MONTHS[view.month]} {view.year}</span>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>
        <div className="cal-grid">
          {DAYS.map((d) => (
            <div key={d} className="cal-dow">{d}</div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="cal-day cal-day-empty" />;
            const dateStr = getDateStr(day);
            const disabled = minDate ? dateStr < minDate : false;
            const selected = value === dateStr;
            const isToday = dateStr === today;
            const cls = [
              "cal-day",
              disabled ? "cal-day-disabled" : "",
              selected ? "cal-day-selected" : "",
              isToday && !selected ? "cal-day-today" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div key={i} className={cls} onClick={() => !disabled && onChange(dateStr)}>
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
