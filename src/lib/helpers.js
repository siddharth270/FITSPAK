export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const parseLocalDate = (d) => {
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day);
  }
  return new Date(d);
};

export const fmtDate = (d) =>
  parseLocalDate(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const fmtDateShort = (d) =>
  parseLocalDate(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const dayName = (d) =>
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    parseLocalDate(d).getDay()
  ];

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const fmtTimer = (s) => {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
};

export const fmtVolume = (n) =>
  n >= 10000
    ? `${(n / 1000).toFixed(1)}k`
    : n >= 1000
    ? `${(n / 1000).toFixed(1)}k`
    : String(n);

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const calcVolume = (exercises) => {
  let volume = 0;
  let sets = 0;
  for (const ex of exercises) {
    for (const s of ex.sets) {
      const w = parseFloat(s.weight) || 0;
      const r = parseInt(s.reps, 10) || 0;
      if (w > 0 && r > 0) {
        volume += w * r;
        sets++;
      }
    }
  }
  return { volume, sets };
};
