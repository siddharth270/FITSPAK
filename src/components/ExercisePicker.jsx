import { useState, useMemo } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import exercisesData from "../data/exercises.json";

const ALL_MUSCLES = [
  ...new Set(exercisesData.flatMap((e) => [...e.primaryMuscles, ...e.secondaryMuscles])),
].sort();
const ALL_EQUIPMENT = [...new Set(exercisesData.map((e) => e.equipment))].sort();

export default function ExercisePicker({ onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("");
  const [equip, setEquip] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return exercisesData.filter((ex) => {
      const q = search.toLowerCase();
      return (
        (!q || ex.name.toLowerCase().includes(q)) &&
        (!muscle || ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)) &&
        (!equip || ex.equipment === equip)
      );
    });
  }, [search, muscle, equip]);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-[200] bg-[#F2F2F7] dark:bg-black flex flex-col"
    >
      {/* iOS-style nav bar */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-b border-[#C6C6C8]/30 dark:border-[#38383A]/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onClose}
            className="text-ios-blue text-[17px] font-sf font-normal"
          >
            Cancel
          </button>
          <span className="text-[17px] font-sf font-semibold">Add Exercise</span>
          <div className="w-[60px]" />
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]"
            />
            <input
              type="text"
              placeholder="Search"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#E5E5EA]/60 dark:bg-[#39393D] rounded-[10px]
                py-[9px] pl-9 pr-4 text-[17px] font-sf outline-none
                text-black dark:text-white placeholder-[#8E8E93]"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-1 px-3 py-[6px] rounded-full text-[13px] font-sf font-medium border transition-colors ${
              muscle || equip
                ? "bg-ios-blue text-white border-ios-blue"
                : "bg-white dark:bg-[#2C2C2E] text-black dark:text-white border-[#C6C6C8]/40 dark:border-[#48484A]"
            }`}
          >
            Filters
            <ChevronDown size={14} className={filtersOpen ? "rotate-180 transition-transform" : "transition-transform"} />
          </button>
          {muscle && (
            <span className="px-3 py-[6px] rounded-full text-[13px] font-sf font-medium bg-ios-blue/10 text-ios-blue">
              {muscle}
              <button onClick={() => setMuscle("")} className="ml-1 opacity-60">×</button>
            </span>
          )}
          {equip && (
            <span className="px-3 py-[6px] rounded-full text-[13px] font-sf font-medium bg-ios-blue/10 text-ios-blue">
              {equip}
              <button onClick={() => setEquip("")} className="ml-1 opacity-60">×</button>
            </span>
          )}
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-sf font-medium text-[#8E8E93] uppercase tracking-wide mb-1 block">
                    Muscle Group
                  </label>
                  <select
                    value={muscle}
                    onChange={(e) => setMuscle(e.target.value)}
                    className="w-full bg-white dark:bg-[#2C2C2E] border border-[#C6C6C8]/40 dark:border-[#48484A]
                      rounded-[10px] py-[10px] px-3 text-[15px] font-sf outline-none
                      text-black dark:text-white"
                  >
                    <option value="">All</option>
                    {ALL_MUSCLES.map((m) => (
                      <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-sf font-medium text-[#8E8E93] uppercase tracking-wide mb-1 block">
                    Equipment
                  </label>
                  <select
                    value={equip}
                    onChange={(e) => setEquip(e.target.value)}
                    className="w-full bg-white dark:bg-[#2C2C2E] border border-[#C6C6C8]/40 dark:border-[#48484A]
                      rounded-[10px] py-[10px] px-3 text-[15px] font-sf outline-none
                      text-black dark:text-white"
                  >
                    <option value="">All</option>
                    {ALL_EQUIPMENT.map((e) => (
                      <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-[13px] font-sf text-[#8E8E93] px-5 pt-3 pb-1">
          {filtered.length} EXERCISE{filtered.length !== 1 ? "S" : ""}
        </p>

        <div className="mx-4 bg-white dark:bg-[#1C1C1E] rounded-ios-lg overflow-hidden">
          {filtered.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => onSelect(ex)}
              className={`w-full text-left flex items-center justify-between px-4 py-3.5
                active:bg-[#D1D1D6]/40 dark:active:bg-[#3A3A3C] transition-colors
                ${i < filtered.length - 1 ? "border-b border-[#C6C6C8]/25 dark:border-[#38383A]/60 ml-4" : ""}`}
              style={i < filtered.length - 1 ? { borderBottomWidth: "0.5px" } : {}}
            >
              <div className={i < filtered.length - 1 ? "-ml-4" : ""}>
                <div className="text-[17px] font-sf text-black dark:text-white">
                  {ex.name}
                </div>
                <div className="flex items-center gap-2 mt-[3px]">
                  <span className="text-[13px] font-sf text-ios-blue font-medium capitalize">
                    {ex.primaryMuscles[0]}
                  </span>
                  <span className="text-[13px] font-sf text-[#8E8E93] capitalize">
                    {ex.equipment}
                  </span>
                </div>
              </div>
              <Plus size={20} className="text-ios-blue flex-shrink-0" />
            </button>
          ))}
        </div>
        <div className="h-8" />
      </div>
    </motion.div>
  );
}
