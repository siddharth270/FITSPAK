import { useState, useEffect } from "react";
import { Plus, Trash2, Check, Dumbbell, Minus, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { fmtTimer } from "../lib/helpers";
import ExercisePicker from "../components/ExercisePicker";
import ExerciseDetailModal from "../components/ExerciseDetailModal";
import exercisesData from "../data/exercises.json";

const exerciseById = Object.fromEntries(exercisesData.map((e) => [e.id, e]));

export default function WorkoutSession() {
  const { activeWorkout, setActiveWorkout, finishWorkout, cancelWorkout } = useApp();
  const [showPicker, setShowPicker] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [confirmRemoveEx, setConfirmRemoveEx] = useState(null);
  const [detailExercise, setDetailExercise] = useState(null);

  useEffect(() => {
    const iv = setInterval(
      () => setElapsed(Math.floor((Date.now() - activeWorkout.startedAt) / 1000)),
      1000
    );
    return () => clearInterval(iv);
  }, [activeWorkout.startedAt]);

  const addExercise = (ex) => {
    setActiveWorkout((p) => ({
      ...p,
      exercises: [
        ...p.exercises,
        { exerciseId: ex.id, name: ex.name, sets: [{ weight: "", reps: "", done: false }] },
      ],
    }));
    setShowPicker(false);
  };

  const removeExercise = (idx) => {
    setActiveWorkout((p) => ({ ...p, exercises: p.exercises.filter((_, i) => i !== idx) }));
    setConfirmRemoveEx(null);
  };

  const addSet = (ei) =>
    setActiveWorkout((p) => {
      const exs = [...p.exercises];
      const last = exs[ei].sets[exs[ei].sets.length - 1];
      exs[ei] = {
        ...exs[ei],
        sets: [...exs[ei].sets, { weight: last?.weight || "", reps: last?.reps || "", done: false }],
      };
      return { ...p, exercises: exs };
    });

  const removeSet = (ei, si) =>
    setActiveWorkout((p) => {
      const exs = [...p.exercises];
      // Don't allow removing the last set — remove the exercise instead
      if (exs[ei].sets.length <= 1) return p;
      exs[ei] = { ...exs[ei], sets: exs[ei].sets.filter((_, i) => i !== si) };
      return { ...p, exercises: exs };
    });

  const updateSet = (ei, si, field, val) =>
    setActiveWorkout((p) => {
      const exs = [...p.exercises];
      const sets = [...exs[ei].sets];
      sets[si] = { ...sets[si], [field]: val };
      exs[ei] = { ...exs[ei], sets };
      return { ...p, exercises: exs };
    });

  const toggleDone = (ei, si) =>
    setActiveWorkout((p) => {
      const exs = [...p.exercises];
      const sets = [...exs[ei].sets];
      sets[si] = { ...sets[si], done: !sets[si].done };
      exs[ei] = { ...exs[ei], sets };
      return { ...p, exercises: exs };
    });

  const hasEx = activeWorkout.exercises.length > 0;

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-8">
      <AnimatePresence>
        {showPicker && <ExercisePicker onSelect={addExercise} onClose={() => setShowPicker(false)} />}
        {detailExercise && (
          <ExerciseDetailModal exercise={detailExercise} onClose={() => setDetailExercise(null)} />
        )}
      </AnimatePresence>

      {/* iOS-style sticky nav bar */}
      <div
        className="sticky top-0 z-50
          bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl
          border-b border-[#C6C6C8]/30 dark:border-[#38383A]/50
          flex items-center justify-between px-4 py-3"
      >
        <button onClick={cancelWorkout} className="text-ios-red text-[17px] font-sf">
          Cancel
        </button>
        <div className="text-center">
          <div className="text-[15px] font-sf font-semibold font-mono tracking-wider text-ios-blue">
            {fmtTimer(elapsed)}
          </div>
        </div>
        <button
          onClick={finishWorkout}
          disabled={!hasEx}
          className={`text-[17px] font-sf font-semibold transition-opacity ${
            hasEx ? "text-ios-blue" : "text-[#C7C7CC] cursor-default"
          }`}
        >
          Finish
        </button>
      </div>

      <div className="px-4 pt-4">
        {/* Empty state */}
        {!hasEx && (
          <div className="text-center py-20">
            <div className="w-[64px] h-[64px] bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell size={28} className="text-[#8E8E93]" />
            </div>
            <p className="text-[17px] font-sf font-semibold text-[#8E8E93]">No Exercises Yet</p>
            <p className="text-[15px] font-sf text-[#AEAEB2] mt-1">Tap below to add your first exercise</p>
          </div>
        )}

        {/* Exercise cards — iOS grouped style */}
        {activeWorkout.exercises.map((ex, ei) => (
          <motion.div
            key={ei}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm mb-3 overflow-hidden"
          >
            {/* Exercise name header */}
            <div className="flex justify-between items-center px-4 pt-4 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[17px] font-sf font-semibold text-ios-blue truncate">{ex.name}</h3>
                <button
                  onClick={() => setDetailExercise(exerciseById[ex.exerciseId] ?? null)}
                  className="p-1 text-[#8E8E93] active:text-ios-blue transition-colors flex-shrink-0"
                >
                  <Info size={16} />
                </button>
              </div>
              {confirmRemoveEx === ei ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeExercise(ei)}
                    className="px-3 py-[5px] rounded-full bg-ios-red text-white text-[13px] font-sf font-semibold
                      active:opacity-80 transition-opacity"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setConfirmRemoveEx(null)}
                    className="px-3 py-[5px] rounded-full bg-[#E5E5EA] dark:bg-[#3A3A3C] text-[13px] font-sf font-semibold
                      text-black dark:text-white"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmRemoveEx(ei)}
                  className="p-1.5 text-[#C7C7CC] active:text-ios-red transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Column labels */}
            <div className={`grid ${ex.sets.length > 1 ? "grid-cols-[28px_36px_1fr_1fr_48px]" : "grid-cols-[40px_1fr_1fr_48px]"} gap-2 px-4 mb-1.5`}>
              {ex.sets.length > 1 && <span />}
              <span className="text-[11px] font-sf font-semibold text-[#8E8E93] text-center uppercase">Set</span>
              <span className="text-[11px] font-sf font-semibold text-[#8E8E93] text-center uppercase">kg</span>
              <span className="text-[11px] font-sf font-semibold text-[#8E8E93] text-center uppercase">Reps</span>
              <span />
            </div>

            {/* Sets */}
            <div className="px-4 pb-2">
              {ex.sets.map((s, si) => (
                <motion.div
                  key={si}
                  layout
                  className={`grid ${ex.sets.length > 1 ? "grid-cols-[28px_36px_1fr_1fr_48px]" : "grid-cols-[40px_1fr_1fr_48px]"} gap-2 mb-2 items-center`}
                >
                  {/* Delete set button — only when 2+ sets */}
                  {ex.sets.length > 1 && (
                    <button
                      onClick={() => removeSet(ei, si)}
                      className="w-[24px] h-[24px] rounded-full bg-ios-red flex items-center justify-center
                        active:opacity-70 transition-opacity mx-auto"
                    >
                      <Minus size={12} className="text-white" strokeWidth={3} />
                    </button>
                  )}
                  <div className={`text-center text-[15px] font-sf font-bold ${s.done ? "text-ios-green" : "text-[#8E8E93]"}`}>
                    {si + 1}
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
                    value={s.weight}
                    onChange={(e) => updateSet(ei, si, "weight", e.target.value)}
                    className={`w-full rounded-[10px] py-[10px] px-3 text-center text-[17px] font-sf font-semibold outline-none transition-colors
                      ${s.done
                        ? "bg-ios-green/8 border border-ios-green/25 text-ios-green"
                        : "bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-transparent text-black dark:text-white"
                      }`}
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={s.reps}
                    onChange={(e) => updateSet(ei, si, "reps", e.target.value)}
                    className={`w-full rounded-[10px] py-[10px] px-3 text-center text-[17px] font-sf font-semibold outline-none transition-colors
                      ${s.done
                        ? "bg-ios-green/8 border border-ios-green/25 text-ios-green"
                        : "bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-transparent text-black dark:text-white"
                      }`}
                  />
                  <button
                    onClick={() => toggleDone(ei, si)}
                    className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all ${
                      s.done
                        ? "bg-ios-green"
                        : "bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-[#D1D1D6] dark:border-[#48484A]"
                    }`}
                  >
                    <Check
                      size={18}
                      strokeWidth={3}
                      className={s.done ? "text-white check-bounce" : "text-[#C7C7CC]"}
                    />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Add set */}
            <button
              onClick={() => addSet(ei)}
              className="w-full py-3 border-t border-[#C6C6C8]/25 dark:border-[#38383A]/60
                text-ios-blue text-[15px] font-sf font-medium
                flex items-center justify-center gap-1
                active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E] transition-colors"
            >
              <Plus size={16} />
              Add Set
            </button>
          </motion.div>
        ))}

        {/* Add exercise button */}
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-[14px] rounded-ios-lg
            bg-ios-blue/8 border-2 border-dashed border-ios-blue/25
            text-ios-blue text-[17px] font-sf font-semibold
            flex items-center justify-center gap-2
            active:bg-ios-blue/15 transition-colors"
        >
          <Plus size={20} />
          Add Exercise
        </button>
      </div>
    </div>
  );
}
