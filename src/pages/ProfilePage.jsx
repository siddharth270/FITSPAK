import { useState, useMemo } from "react";
import { Plus, ChevronLeft, ChevronRight, TrendingUp, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useApp } from "../context/AppContext";
import { fmtDate, fmtVolume, todayISO } from "../lib/helpers";
import WorkoutDetail from "../components/WorkoutDetail";

const TABS = [
  { id: "weight", label: "Weight" },
  { id: "history", label: "History" },
  { id: "calendar", label: "Calendar" },
];

export default function ProfilePage() {
  const { dark, workouts, weightLog, logWeight } = useApp();
  const [sub, setSub] = useState("weight");
  const [wInput, setWInput] = useState("");
  const [dInput, setDInput] = useState(todayISO());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handleLog = () => {
    const v = parseFloat(wInput);
    if (!v || !dInput) return;
    logWeight(dInput, v);
    setWInput("");
  };

  const chartData = weightLog.map((e) => ({
    date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: e.weight,
  }));

  const workoutDates = useMemo(() => new Set(workouts.map((w) => w.date)), [workouts]);

  const calDays = useMemo(() => {
    const first = new Date(calYear, calMonth, 1).getDay();
    const total = new Date(calYear, calMonth + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < first; i++) arr.push(null);
    for (let d = 1; d <= total; d++) arr.push(d);
    return arr;
  }, [calMonth, calYear]);

  const todayStr = todayISO();

  const blue = "#007AFF";
  const grid = dark ? "#2C2C2E" : "#E5E5EA";
  const tick = dark ? "#636366" : "#AEAEB2";
  const tipBg = dark ? "#2C2C2E" : "#FFFFFF";
  const tipBorder = dark ? "#48484A" : "#E5E5EA";

  return (
    <div className="px-4 pt-3">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[34px] font-sf font-bold tracking-tight mb-4"
      >
        Stats
      </motion.h1>

      {/* iOS Segmented Control */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
        className="ios-segment mb-5"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={`ios-segment-btn ${
              sub === t.id ? "ios-segment-active" : "ios-segment-inactive"
            }`}
          >
            {t.label}
          </button>
        ))}
      </motion.div>

      {/* ─── WEIGHT ─── */}
      {sub === "weight" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Input card */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm p-4 mb-4">
            <h3 className="text-[13px] font-sf font-medium text-[#8E8E93] uppercase tracking-wide mb-3">
              Log Body Weight
            </h3>
            <div className="flex gap-2">
              <input
                type="date"
                value={dInput}
                onChange={(e) => setDInput(e.target.value)}
                className="flex-1 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[10px]
                  py-[10px] px-3 text-[15px] font-sf outline-none
                  text-black dark:text-white border border-transparent"
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder="kg"
                value={wInput}
                onChange={(e) => setWInput(e.target.value)}
                className="w-[88px] bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[10px]
                  py-[10px] px-3 text-center text-[17px] font-sf font-semibold outline-none
                  text-black dark:text-white border border-transparent"
              />
              <button
                onClick={handleLog}
                className="w-[44px] h-[44px] rounded-full bg-ios-blue flex items-center justify-center
                  active:opacity-80 transition-opacity flex-shrink-0"
              >
                <Plus size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 1 ? (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm p-4 pb-2 mb-4">
              <h3 className="text-[13px] font-sf font-medium text-[#8E8E93] uppercase tracking-wide mb-3">
                Weight Trend
              </h3>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={blue} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: tick, fontFamily: "-apple-system" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    tick={{ fontSize: 10, fill: tick, fontFamily: "-apple-system" }}
                    axisLine={false}
                    tickLine={false}
                    width={34}
                  />
                  <Tooltip
                    contentStyle={{
                      background: tipBg,
                      border: `1px solid ${tipBorder}`,
                      borderRadius: 12,
                      fontFamily: "-apple-system",
                      fontSize: 13,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke={blue}
                    strokeWidth={2.5}
                    fill="url(#grad)"
                    dot={{ fill: blue, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0, fill: blue }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm p-10 text-center mb-4">
              <TrendingUp size={32} className="mx-auto mb-3 text-[#C7C7CC]" />
              <p className="text-[15px] font-sf text-[#8E8E93]">
                Log at least 2 entries to see your trend
              </p>
            </div>
          )}

          {/* Entries */}
          {weightLog.length > 0 && (
            <div>
              <h3 className="text-[13px] font-sf font-medium text-[#8E8E93] uppercase tracking-wide px-1 mb-2">
                Entries
              </h3>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm overflow-hidden">
                {[...weightLog].reverse().slice(0, 10).map((e, i, arr) => (
                  <div
                    key={i}
                    className={`flex justify-between px-4 py-3 ${
                      i < arr.length - 1 ? "border-b border-[#C6C6C8]/25 dark:border-[#38383A]/60" : ""
                    }`}
                  >
                    <span className="text-[15px] font-sf text-[#8E8E93]">{fmtDate(e.date)}</span>
                    <span className="text-[15px] font-sf font-semibold">{e.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── HISTORY ─── */}
      {sub === "history" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AnimatePresence>
            {selectedWorkout && (
              <WorkoutDetail
                workout={selectedWorkout}
                onClose={() => setSelectedWorkout(null)}
              />
            )}
          </AnimatePresence>

          {workouts.length === 0 ? (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm p-12 text-center">
              <Dumbbell size={36} className="mx-auto mb-3 text-[#C7C7CC]" />
              <p className="text-[17px] font-sf font-semibold text-[#8E8E93]">No Workouts Yet</p>
              <p className="text-[15px] font-sf text-[#AEAEB2] mt-1">Start training to see your history</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm overflow-hidden">
              {workouts.map((w, i) => {
                const mins = Math.floor((w.finishedAt - w.startedAt) / 60000);
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWorkout(w)}
                    className={`w-full text-left flex items-center justify-between px-4 py-3.5
                      active:bg-[#D1D1D6]/30 dark:active:bg-[#3A3A3C]/50 transition-colors ${
                        i < workouts.length - 1
                          ? "border-b border-[#C6C6C8]/25 dark:border-[#38383A]/60"
                          : ""
                      }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[17px] font-sf font-medium">
                        {fmtDate(w.date)}
                      </div>
                      <div className="text-[13px] font-sf text-[#8E8E93] mt-[2px] truncate">
                        {w.exercises.map((e) => e.name).join(", ")}
                      </div>
                      <div className="text-[12px] font-sf text-[#AEAEB2] mt-[2px]">
                        {w.exercises.length} exercises · {w.totalSets} sets · {mins} min
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <div className="text-right">
                        <div className="text-[17px] font-sf font-semibold text-ios-blue">
                          {fmtVolume(w.totalVolume)}
                        </div>
                        <div className="text-[11px] font-sf text-[#8E8E93]">kg</div>
                      </div>
                      <ChevronRight size={16} className="text-[#C7C7CC]" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ─── CALENDAR ─── */}
      {sub === "calendar" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm p-5">
            {/* Month nav */}
            <div className="flex justify-between items-center mb-5">
              <button
                onClick={() => {
                  const d = new Date(calYear, calMonth - 1);
                  setCalMonth(d.getMonth());
                  setCalYear(d.getFullYear());
                }}
                className="w-[32px] h-[32px] rounded-full bg-[#F2F2F7] dark:bg-[#3A3A3C] flex items-center justify-center"
              >
                <ChevronLeft size={18} className="text-ios-blue" />
              </button>
              <h3 className="text-[17px] font-sf font-semibold">
                {new Date(calYear, calMonth).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={() => {
                  const d = new Date(calYear, calMonth + 1);
                  setCalMonth(d.getMonth());
                  setCalYear(d.getFullYear());
                }}
                className="w-[32px] h-[32px] rounded-full bg-[#F2F2F7] dark:bg-[#3A3A3C] flex items-center justify-center"
              >
                <ChevronRight size={18} className="text-ios-blue" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center text-[11px] font-sf font-semibold text-[#8E8E93] py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, i) => {
                if (day === null) return <div key={i} />;
                const ds = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const has = workoutDates.has(ds);
                const isToday = ds === todayStr;
                return (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded-full text-[15px] font-sf transition-colors ${
                      has
                        ? "bg-ios-blue text-white font-bold"
                        : isToday
                        ? "bg-[#E5E5EA] dark:bg-[#3A3A3C] font-semibold"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="text-center mt-5 pt-4 border-t border-[#C6C6C8]/25 dark:border-[#38383A]/60">
              <div className="text-[34px] font-sf font-bold text-ios-blue leading-none">
                {workoutDates.size}
              </div>
              <div className="text-[13px] font-sf text-[#8E8E93] mt-1">
                total workout{workoutDates.size !== 1 ? "s" : ""} logged
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
