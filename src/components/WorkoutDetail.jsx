import { ArrowLeft, Clock, Zap, Target, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";
import { fmtDate, fmtVolume } from "../lib/helpers";

export default function WorkoutDetail({ workout, onClose }) {
  const mins = Math.floor((workout.finishedAt - workout.startedAt) / 60000);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="fixed inset-0 z-[150] bg-[#F2F2F7] dark:bg-black flex flex-col"
    >
      {/* iOS nav bar */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-b border-[#C6C6C8]/30 dark:border-[#38383A]/50">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={onClose}
            className="flex items-center gap-0.5 text-ios-blue text-[17px] font-sf"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-5 pb-8">
          {/* Title + Date */}
          <h1 className="text-[28px] font-sf font-bold tracking-tight mb-1">
            Workout Summary
          </h1>
          <p className="text-[15px] font-sf text-[#8E8E93] mb-5">
            {fmtDate(workout.date)}
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {[
              { icon: Clock, color: "text-ios-orange", bg: "bg-ios-orange/10", val: `${mins}m`, label: "Duration" },
              { icon: Zap, color: "text-ios-blue", bg: "bg-ios-blue/10", val: fmtVolume(workout.totalVolume), label: "Volume (kg)" },
              { icon: Target, color: "text-ios-green", bg: "bg-ios-green/10", val: workout.totalSets, label: "Total Sets" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm p-3.5"
              >
                <div className={`w-[30px] h-[30px] ${s.bg} rounded-[8px] flex items-center justify-center mb-2`}>
                  <s.icon size={16} className={s.color} />
                </div>
                <div className="text-[22px] font-sf font-bold leading-none">{s.val}</div>
                <div className="text-[11px] font-sf font-medium text-[#8E8E93] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Exercises — iOS grouped sections */}
          <h3 className="text-[13px] font-sf font-medium text-[#8E8E93] uppercase tracking-wide px-1 mb-2">
            Exercises
          </h3>

          {workout.exercises.map((ex, i) => {
            const validSets = ex.sets.filter(
              (s) => (parseFloat(s.weight) || 0) > 0 || (parseInt(s.reps) || 0) > 0
            );
            const exVolume = ex.sets.reduce((sum, s) => {
              const w = parseFloat(s.weight) || 0;
              const r = parseInt(s.reps) || 0;
              return sum + w * r;
            }, 0);

            return (
              <div
                key={i}
                className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm mb-3 overflow-hidden"
              >
                {/* Exercise header */}
                <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-[36px] h-[36px] bg-ios-blue/10 rounded-[10px] flex items-center justify-center">
                      <Dumbbell size={18} className="text-ios-blue" />
                    </div>
                    <div>
                      <div className="text-[17px] font-sf font-semibold">{ex.name}</div>
                      <div className="text-[13px] font-sf text-[#8E8E93]">
                        {validSets.length} set{validSets.length !== 1 ? "s" : ""} · {fmtVolume(exVolume)} kg
                      </div>
                    </div>
                  </div>
                </div>

                {/* Set table header */}
                <div className="grid grid-cols-[48px_1fr_1fr_1fr] gap-1 px-4 pb-1.5">
                  <span className="text-[11px] font-sf font-semibold text-[#8E8E93] text-center uppercase">Set</span>
                  <span className="text-[11px] font-sf font-semibold text-[#8E8E93] text-center uppercase">Weight</span>
                  <span className="text-[11px] font-sf font-semibold text-[#8E8E93] text-center uppercase">Reps</span>
                  <span className="text-[11px] font-sf font-semibold text-[#8E8E93] text-center uppercase">Volume</span>
                </div>

                {/* Set rows */}
                {ex.sets.map((s, j) => {
                  const wt = parseFloat(s.weight) || 0;
                  const rp = parseInt(s.reps) || 0;
                  const vol = wt * rp;
                  if (wt === 0 && rp === 0) return null;
                  return (
                    <div
                      key={j}
                      className={`grid grid-cols-[48px_1fr_1fr_1fr] gap-1 px-4 py-3 items-center ${
                        j < ex.sets.length - 1
                          ? "border-b border-[#C6C6C8]/20 dark:border-[#38383A]/40"
                          : ""
                      }`}
                    >
                      <div className="text-center">
                        <span className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-full bg-ios-blue/10 text-ios-blue text-[13px] font-sf font-bold">
                          {j + 1}
                        </span>
                      </div>
                      <div className="text-center text-[15px] font-sf font-semibold">
                        {wt} <span className="text-[13px] text-[#8E8E93] font-normal">kg</span>
                      </div>
                      <div className="text-center text-[15px] font-sf font-semibold">
                        {rp} <span className="text-[13px] text-[#8E8E93] font-normal">reps</span>
                      </div>
                      <div className="text-center text-[15px] font-sf font-semibold text-ios-blue">
                        {fmtVolume(vol)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
