import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { fmtDate, fmtVolume } from "../lib/helpers";

export default function SummaryModal() {
  const { showSummary: w, setShowSummary, setTab } = useApp();
  if (!w) return null;

  const mins = Math.floor((w.finishedAt - w.startedAt) / 60000);

  const close = () => {
    setShowSummary(null);
    setTab("home");
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        className="bg-white dark:bg-[#2C2C2E] rounded-[24px] p-7 w-full max-w-[360px] text-center shadow-ios-lg"
      >
        {/* Icon */}
        <div className="w-[60px] h-[60px] rounded-full bg-ios-green/12 flex items-center justify-center mx-auto mb-4">
          <Trophy size={28} className="text-ios-green" />
        </div>

        <h2 className="text-[22px] font-sf font-bold mb-0.5">
          Workout Complete
        </h2>
        <p className="text-[15px] font-sf text-[#8E8E93] mb-5">
          {fmtDate(w.date)}
        </p>

        {/* Stat boxes */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[
            { label: "Duration", val: `${mins}m` },
            { label: "Volume", val: `${fmtVolume(w.totalVolume)}` },
            { label: "Sets", val: w.totalSets },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[#F2F2F7] dark:bg-[#3A3A3C] rounded-[14px] py-3.5 px-1"
            >
              <div className="text-[20px] font-sf font-bold text-ios-blue">
                {s.val}
              </div>
              <div className="text-[11px] font-sf text-[#8E8E93] mt-0.5 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Exercise list */}
        <div className="text-left mb-6 bg-[#F2F2F7] dark:bg-[#3A3A3C] rounded-[14px] overflow-hidden">
          {w.exercises.map((ex, i) => {
            const done = ex.sets.filter(
              (s) => (parseFloat(s.weight) || 0) > 0 && (parseInt(s.reps) || 0) > 0
            );
            return (
              <div
                key={i}
                className={`flex justify-between items-center px-4 py-3 ${
                  i < w.exercises.length - 1 ? "border-b border-[#C6C6C8]/25 dark:border-[#48484A]/50" : ""
                }`}
              >
                <span className="text-[15px] font-sf font-medium">{ex.name}</span>
                <span className="text-[13px] font-sf text-[#8E8E93]">
                  {done.length} set{done.length !== 1 ? "s" : ""}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={close}
          className="w-full py-[14px] rounded-[14px] bg-ios-blue text-white
            text-[17px] font-sf font-semibold
            active:opacity-80 transition-opacity"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
}
