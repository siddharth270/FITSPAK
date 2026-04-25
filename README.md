# JEERA — Workout Tracker

A mobile-first PWA with an iOS-native design language. Track workouts, plan weekly routines, and monitor progress — all data stays on your device via IndexedDB.

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/workout-tracker.git
cd workout-tracker
npm install
npm run dev
```

## Deploy to Netlify

Push to GitHub → Import in [app.netlify.com](https://app.netlify.com) → auto-configured via `netlify.toml`.

## Features

- **Dashboard** — Weekly stats, quick-start workout, today's routine shortcut
- **Workout Logger** — Timer, per-set weight/reps tracking, completion checkmarks
- **Exercise Database** — 43 exercises with search + muscle/equipment filters (swap in your 800+ JSON)
- **Routine Planner** — Mon–Sun weekly split builder
- **Body Weight Tracker** — Recharts trend line with date-logged entries
- **Workout History** — Expandable session cards with full set details
- **Streak Calendar** — Monthly view highlighting workout days
- **Dark / Light Mode** — Persisted toggle
- **PWA** — Installable, offline-capable via Workbox

## Stack

React 18 · Vite 6 · Tailwind CSS 3 · Framer Motion · Recharts · Lucide React · Dexie.js (IndexedDB) · vite-plugin-pwa

## Project Structure

```
src/
├── main.jsx
├── App.jsx
├── index.css
├── context/AppContext.jsx     ← Global state + Dexie CRUD
├── lib/
│   ├── db.js                  ← IndexedDB schema
│   └── helpers.js             ← Utilities
├── data/exercises.json        ← Exercise database (replace with yours)
├── components/
│   ├── BottomNav.jsx
│   ├── ExercisePicker.jsx
│   ├── SummaryModal.jsx
│   └── WorkoutHistoryCard.jsx
└── pages/
    ├── HomePage.jsx
    ├── WorkoutSession.jsx
    ├── RoutinePlanner.jsx
    └── ProfilePage.jsx
```

## Using Your Exercise JSON

Replace `src/data/exercises.json` with your file. Expected schema per object:

```json
{
  "id": "string",
  "name": "string",
  "force": "push | pull | static",
  "level": "beginner | intermediate | expert",
  "mechanic": "compound | isolation",
  "equipment": "string",
  "primaryMuscles": ["string"],
  "secondaryMuscles": ["string"],
  "instructions": ["string"],
  "category": "string",
  "images": ["string"]
}
```

## License

MIT
