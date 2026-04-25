import { Flame, Zap, Trophy, Play, ChevronRight, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { fmtDate, fmtVolume, todayISO } from "../lib/helpers";

const fade = (i) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } },
});

export default function HomePage() {
  const {
    dark, toggleTheme, workouts, todayRoutine,
    startEmptyWorkout, startRoutineWorkout,
  } = useApp();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const thisWeek = workouts.filter((w) => new Date(w.date) >= weekAgo);
  const weekVolume = thisWeek.reduce((s, w) => s + w.totalVolume, 0);
  const recent = workouts.slice(0, 4);

  // Streak + calendar
  const todayStr = todayISO();
  const workoutDates = new Set(workouts.map((w) => w.date));

  let streak = 0;
  const streakCursor = new Date();
  while (true) {
    const iso = `${streakCursor.getFullYear()}-${String(streakCursor.getMonth() + 1).padStart(2, "0")}-${String(streakCursor.getDate()).padStart(2, "0")}`;
    if (!workoutDates.has(iso)) break;
    streak++;
    streakCursor.setDate(streakCursor.getDate() - 1);
  }

  const yr = now.getFullYear();
  const mo = now.getMonth();
  const firstDow = new Date(yr, mo, 1).getDay();
  const daysInMo = new Date(yr, mo + 1, 0).getDate();
  const calCells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMo }, (_, i) => i + 1)];
  while (calCells.length % 7 !== 0) calCells.push(null);
  const isoOf = (d) => `${yr}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="px-4 pt-3">
      {/* iOS Large Title Header */}
      <motion.div {...fade(0)} className="flex justify-between items-start mb-5">
        <div>
          <p className="text-[13px] font-sf font-medium text-[#8E8E93] uppercase tracking-wide">
            {now.toLocaleDateString("en-US", { weekday: "long" })}
          </p>
          <h1 className="text-[34px] font-sf font-bold tracking-tight leading-tight">
            {now.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="mt-2 w-[38px] h-[38px] rounded-full
            bg-[#E5E5EA] dark:bg-[#3A3A3C]
            flex items-center justify-center"
        >
          {dark ? <Sun size={18} className="text-[#FFD60A]" /> : <Moon size={18} className="text-[#8E8E93]" />}
        </button>
      </motion.div>

      {/* Stats — iOS widget-style cards */}
      <motion.div {...fade(1)} className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { icon: Flame, color: "text-ios-orange", bg: "bg-ios-orange/10", val: thisWeek.length, label: "This Week" },
          { icon: Zap, color: "text-ios-green", bg: "bg-ios-green/10", val: fmtVolume(weekVolume), label: "Volume" },
          { icon: Trophy, color: "text-ios-blue", bg: "bg-ios-blue/10", val: workouts.length, label: "All Time" },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg p-3.5 shadow-ios-sm"
          >
            <div className={`w-[30px] h-[30px] ${s.bg} rounded-[8px] flex items-center justify-center mb-2.5`}>
              <s.icon size={16} className={s.color} />
            </div>
            <div className="text-[22px] font-sf font-bold leading-none">{s.val}</div>
            <div className="text-[11px] font-sf text-[#8E8E93] font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Streak Calendar */}
      <motion.div {...fade(2)} className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[17px] font-sf font-semibold">
            {now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <div className="flex items-center gap-1.5">
            <Flame size={18} className={streak > 0 ? "text-ios-orange" : "text-[#C7C7CC]"} />
            <span className={`text-[20px] font-sf font-bold leading-none ${streak > 0 ? "text-ios-orange" : "text-[#C7C7CC]"}`}>
              {streak}
            </span>
            <span className="text-[13px] font-sf text-[#8E8E93]">
              {streak === 1 ? "day streak" : "day streak"}
            </span>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1.5">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-[11px] font-sf font-semibold text-[#8E8E93]">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {calCells.map((day, i) => {
            if (!day) return <div key={i} />;
            const iso = isoOf(day);
            const hasWorkout = workoutDates.has(iso);
            const isToday = iso === todayStr;
            const isFuture = iso > todayStr;
            return (
              <div key={i} className="flex items-center justify-center py-[2px]">
                <div
                  className={`w-[32px] h-[32px] rounded-full flex items-center justify-center
                    ${hasWorkout ? "bg-ios-blue" : ""}
                    ${isToday && !hasWorkout ? "border-[2px] border-ios-blue" : ""}
                  `}
                >
                  <span
                    className={`text-[13px] font-sf font-medium select-none
                      ${hasWorkout ? "text-white font-semibold" : ""}
                      ${isToday && !hasWorkout ? "text-ios-blue font-semibold" : ""}
                      ${!hasWorkout && !isToday && isFuture ? "text-[#C7C7CC] dark:text-[#48484A]" : ""}
                      ${!hasWorkout && !isToday && !isFuture ? "text-black dark:text-white" : ""}
                    `}
                  >
                    {day}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Start — big iOS blue button */}
      <motion.button
        {...fade(3)}
        onClick={startEmptyWorkout}
        className="w-full py-[18px] rounded-ios-lg bg-ios-blue text-white
          font-sf font-semibold text-[17px]
          flex items-center justify-center gap-2
          shadow-ios-button
          active:opacity-80 transition-opacity mb-3"
      >
        <Play size={20} fill="white" />
        Start Empty Workout
      </motion.button>

      {/* Today's Routine */}
      {todayRoutine && (
        <motion.button
          {...fade(4)}
          onClick={startRoutineWorkout}
          className="w-full bg-white dark:bg-[#1C1C1E] rounded-ios-lg p-4 shadow-ios-sm
            flex items-center justify-between text-left mb-5
            active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E] transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-sf font-bold text-ios-green uppercase tracking-wider">
                Today's Routine
              </span>
            </div>
            <div className="text-[17px] font-sf font-semibold">
              {todayRoutine.day} — {todayRoutine.exercises.length} exercises
            </div>
            <div className="text-[13px] font-sf text-[#8E8E93] mt-0.5 truncate">
              {todayRoutine.exercises.slice(0, 3).map((e) => e.name).join(", ")}
              {todayRoutine.exercises.length > 3 && ` +${todayRoutine.exercises.length - 3}`}
            </div>
          </div>
          <ChevronRight size={20} className="text-[#C7C7CC] flex-shrink-0 ml-2" />
        </motion.button>
      )}

      {/* Recent Workouts — iOS grouped list */}
      {recent.length > 0 && (
        <motion.div {...fade(5)}>
          <h3 className="text-[13px] font-sf font-medium text-[#8E8E93] uppercase tracking-wide px-1 mb-2">
            Recent Workouts
          </h3>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm overflow-hidden">
            {recent.map((w, i) => (
              <div
                key={w.id}
                className={`px-4 py-3.5 flex justify-between items-center ${
                  i < recent.length - 1
                    ? "border-b border-[#C6C6C8]/25 dark:border-[#38383A]/60"
                    : ""
                }`}
              >
                <div>
                  <div className="text-[15px] font-sf font-medium">{fmtDate(w.date)}</div>
                  <div className="text-[13px] font-sf text-[#8E8E93] mt-[1px]">
                    {w.exercises.length} exercises · {w.totalSets} sets
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[17px] font-sf font-semibold text-ios-blue">
                    {fmtVolume(w.totalVolume)}
                  </div>
                  <div className="text-[11px] font-sf text-[#8E8E93]">kg</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
