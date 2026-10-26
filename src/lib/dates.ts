// Dates travel as "YYYY-MM-DD" strings and are stored as UTC dates.
export const toDate = (s: string) => new Date(`${s}T00:00:00.000Z`);

export const isValidDate = (s?: string | null) => {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = toDate(s);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};

export const nightsBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);
export const fmt = (d: Date) => d.toISOString().slice(0, 10);
export const todayStr = () => new Date().toISOString().slice(0, 10);
export const money = (n: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: process.env.CURRENCY || "USD", maximumFractionDigits: 0 }).format(n);
