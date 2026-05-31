type HolidayEntry = { date: string; localName: string; name: string };

const cache = new Map<number, HolidayEntry[]>();

const fetchHolidays = async (year: number): Promise<HolidayEntry[]> => {
  if (cache.has(year)) return cache.get(year)!;

  try {
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/RO`,
    );
    if (!res.ok) return [];
    const data = (await res.json()) as HolidayEntry[];
    cache.set(year, data);
    return data;
  } catch {
    return [];
  }
};

export const checkHoliday = async (
  date: Date,
): Promise<{ isHoliday: boolean; name?: string }> => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const holidays = await fetchHolidays(year);
  const match = holidays.find((h) => h.date === dateStr);

  return { isHoliday: !!match, name: match?.localName };
};
