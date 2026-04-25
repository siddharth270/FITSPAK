import { useState } from "react";
import { ChevronRight, ArrowLeft, Plus, Trash2, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { DAYS } from "../lib/helpers";
import ExercisePicker from "../components/ExercisePicker";

export default function RoutinePlanner() {
  const { routines, updateRoutine } = useApp();
  const [selectedDay, setSelectedDay] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const addToDay = (ex) => {
    if (!selectedDay) return;
    const cur = routines[selectedDay] || [];
    updateRoutine(selectedDay, [...cur, { exerciseId: ex.id, name: ex.name }]);
    setShowPicker(false);
  };

  const removeFromDay = (idx) => {
    if (!selectedDay) return;
    updateRoutine(selectedDay, (routines[selectedDay] || []).filter((_, i) => i !== idx));
  };

  // ─── Day detail ───
  if (selectedDay) {
    const exercises = routines[selectedDay] || [];

    return (
      <div className="min-h-screen">
        <AnimatePresence>
          {showPicker && <ExercisePicker onSelect={addToDay} onClose={() => setShowPicker(false)} />}
        </AnimatePresence>

        {/* iOS inline nav */}
        <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-b border-[#C6C6C8]/30 dark:border-[#38383A]/50">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => setSelectedDay(null)}
              className="flex items-center gap-0.5 text-ios-blue text-[17px] font-sf"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="px-4 pt-4"
        >
          <h1 className="text-[34px] font-sf font-bold tracking-tight mb-1">{selectedDay}</h1>
          <p className="text-[15px] font-sf text-[#8E8E93] mb-5">
            {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} planned
          </p>

          {/* Exercise list — iOS grouped */}
          {exercises.length > 0 && (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm overflow-hidden mb-4">
              {exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-4 py-3.5 ${
                    idx < exercises.length - 1
                      ? "border-b border-[#C6C6C8]/25 dark:border-[#38383A]/60"
                      : ""
                  }`}
                >
                  <span className="text-[17px] font-sf">{ex.name}</span>
                  <button
                    onClick={() => removeFromDay(idx)}
                    className="w-[28px] h-[28px] rounded-full bg-ios-red flex items-center justify-center"
                  >
                    <Minus size={14} className="text-white" strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add exercise */}
          <button
            onClick={() => setShowPicker(true)}
            className="w-full bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm
              py-3.5 text-ios-blue text-[17px] font-sf font-medium
              flex items-center justify-center gap-1.5
              active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E] transition-colors"
          >
            <Plus size={20} />
            Add Exercise
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Week overview ───
  return (
    <div className="px-4 pt-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-[34px] font-sf font-bold tracking-tight mb-1">Routines</h1>
        <p className="text-[15px] font-sf text-[#8E8E93] mb-5">Plan your weekly split</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm overflow-hidden"
      >
        {DAYS.map((day, i) => {
          const dayEx = routines[day] || [];
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`w-full text-left flex items-center justify-between px-4 py-3.5
                active:bg-[#D1D1D6]/30 dark:active:bg-[#3A3A3C]/50 transition-colors
                ${i < DAYS.length - 1 ? "border-b border-[#C6C6C8]/25 dark:border-[#38383A]/60" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[17px] font-sf font-medium">{day}</div>
                {dayEx.length > 0 ? (
                  <div className="text-[13px] font-sf text-[#8E8E93] mt-[2px] truncate">
                    {dayEx.slice(0, 2).map((e) => e.name).join(", ")}
                    {dayEx.length > 2 && ` +${dayEx.length - 2}`}
                  </div>
                ) : (
                  <div className="text-[13px] font-sf text-[#C7C7CC] mt-[2px]">Rest day</div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {dayEx.length > 0 && (
                  <span className="bg-ios-blue/10 text-ios-blue text-[13px] font-sf font-semibold px-2.5 py-[2px] rounded-full">
                    {dayEx.length}
                  </span>
                )}
                <ChevronRight size={18} className="text-[#C7C7CC]" />
              </div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
