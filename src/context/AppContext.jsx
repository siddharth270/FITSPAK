import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import db from "../lib/db";
import { uid, todayISO, dayName, calcVolume } from "../lib/helpers";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [dark, setDark] = useState(false); // light by default

  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState({});
  const [weightLog, setWeightLog] = useState([]);

  const [activeWorkout, setActiveWorkout] = useState(null);
  const [showSummary, setShowSummary] = useState(null);
  const [tab, setTab] = useState("home");

  /* ─── Load from IndexedDB ─── */
  useEffect(() => {
    (async () => {
      try {
        const [wks, rts, wts, thm] = await Promise.all([
          db.workouts.orderBy("date").reverse().toArray(),
          db.routines.toArray(),
          db.weightEntries.orderBy("date").toArray(),
          db.settings.get("theme"),
        ]);
        setWorkouts(wks || []);
        const map = {};
        (rts || []).forEach((r) => (map[r.day] = r.exercises));
        setRoutines(map);
        setWeightLog(wts || []);
        if (thm !== undefined && thm !== null) setDark(thm.value);
      } catch (e) {
        console.error("DB load:", e);
      }
      setLoaded(true);
    })();
  }, []);

  /* ─── Theme ─── */
  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      db.settings.put({ key: "theme", value: next });
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#000000" : "#F2F2F7");
  }, [dark]);

  /* ─── Today's routine ─── */
  const todayRoutine = useMemo(() => {
    const d = dayName(new Date());
    const exs = routines[d];
    return exs?.length ? { day: d, exercises: exs } : null;
  }, [routines]);

  /* ─── Workout actions ─── */
  const startEmptyWorkout = useCallback(() => {
    setActiveWorkout({ id: uid(), startedAt: Date.now(), exercises: [] });
    setTab("workout");
  }, []);

  const startRoutineWorkout = useCallback(() => {
    if (!todayRoutine) return;
    const exercises = todayRoutine.exercises.map((e) => ({
      ...e,
      sets: [{ weight: "", reps: "", done: false }],
    }));
    setActiveWorkout({ id: uid(), startedAt: Date.now(), exercises });
    setTab("workout");
  }, [todayRoutine]);

  const finishWorkout = useCallback(async () => {
    if (!activeWorkout || !activeWorkout.exercises.length) return;
    const { volume, sets } = calcVolume(activeWorkout.exercises);
    const completed = {
      id: activeWorkout.id,
      date: todayISO(),
      startedAt: activeWorkout.startedAt,
      finishedAt: Date.now(),
      exercises: activeWorkout.exercises,
      totalVolume: volume,
      totalSets: sets,
    };
    try {
      await db.workouts.put(completed);
    } catch {}
    setWorkouts((prev) => [completed, ...prev]);
    setShowSummary(completed);
    setActiveWorkout(null);
  }, [activeWorkout]);

  const cancelWorkout = useCallback(() => {
    setActiveWorkout(null);
    setTab("home");
  }, []);

  /* ─── Routine actions ─── */
  const updateRoutine = useCallback(async (day, exercises) => {
    setRoutines((prev) => ({ ...prev, [day]: exercises }));
    try {
      await db.routines.put({ day, exercises });
    } catch {}
  }, []);

  /* ─── Weight log ─── */
  const logWeight = useCallback(async (date, weight) => {
    const entry = { date, weight };
    try {
      await db.weightEntries.put(entry);
    } catch {}
    setWeightLog((prev) => {
      const updated = [...prev.filter((e) => e.date !== date), entry];
      updated.sort((a, b) => a.date.localeCompare(b.date));
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        loaded,
        dark,
        toggleTheme,
        tab,
        setTab,
        workouts,
        routines,
        updateRoutine,
        weightLog,
        logWeight,
        activeWorkout,
        setActiveWorkout,
        showSummary,
        setShowSummary,
        todayRoutine,
        startEmptyWorkout,
        startRoutineWorkout,
        finishWorkout,
        cancelWorkout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
