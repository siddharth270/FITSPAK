import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const imgModules = import.meta.glob("../data/exercises/**/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

function resolveImg(path) {
  return imgModules[`../data/exercises/${path}`] ?? null;
}

export default function ExerciseDetailModal({ exercise, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = exercise.images ?? [];

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-[300] bg-[#F2F2F7] dark:bg-black flex flex-col"
    >
      {/* Nav */}
      <div className="sticky top-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-b border-[#C6C6C8]/30 dark:border-[#38383A]/50 flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div className="w-8" />
        <span className="text-[17px] font-sf font-semibold text-black dark:text-white leading-tight text-center flex-1 px-2">
          {exercise.name}
        </span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E5E5EA] dark:bg-[#3A3A3C] active:opacity-70 transition-opacity"
        >
          <X size={16} className="text-[#8E8E93]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-8 space-y-4">

          {/* Images */}
          {imgs.length > 0 && (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm overflow-hidden">
              <img
                key={imgIdx}
                src={resolveImg(imgs[imgIdx])}
                alt={`${exercise.name} position ${imgIdx + 1}`}
                className="w-full object-contain max-h-[300px] bg-[#F2F2F7] dark:bg-[#2C2C2E]"
              />
              {imgs.length > 1 && (
                <div className="flex border-t border-[#C6C6C8]/25 dark:border-[#38383A]/60">
                  {imgs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`flex-1 py-2.5 text-[13px] font-sf font-medium transition-colors ${
                        i === imgIdx
                          ? "text-ios-blue bg-ios-blue/5"
                          : "text-[#8E8E93] active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E]"
                      } ${i === 0 ? "border-r border-[#C6C6C8]/25 dark:border-[#38383A]/60" : ""}`}
                    >
                      {i === 0 ? "Start" : "End"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            {[
              exercise.level,
              exercise.category,
              exercise.equipment,
              exercise.mechanic,
              exercise.force,
            ]
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-[5px] rounded-full bg-white dark:bg-[#1C1C1E] shadow-ios-sm text-[13px] font-sf font-medium text-[#3C3C43] dark:text-[#EBEBF5] capitalize"
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* Muscles */}
          {(exercise.primaryMuscles?.length > 0 || exercise.secondaryMuscles?.length > 0) && (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm divide-y divide-[#C6C6C8]/25 dark:divide-[#38383A]/60">
              {exercise.primaryMuscles?.length > 0 && (
                <div className="px-4 py-3">
                  <p className="text-[11px] font-sf font-semibold text-[#8E8E93] uppercase tracking-wide mb-1.5">
                    Primary
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.primaryMuscles.map((m) => (
                      <span key={m} className="px-2.5 py-1 rounded-full bg-ios-blue/10 text-ios-blue text-[13px] font-sf font-medium capitalize">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {exercise.secondaryMuscles?.length > 0 && (
                <div className="px-4 py-3">
                  <p className="text-[11px] font-sf font-semibold text-[#8E8E93] uppercase tracking-wide mb-1.5">
                    Secondary
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.secondaryMuscles.map((m) => (
                      <span key={m} className="px-2.5 py-1 rounded-full bg-[#E5E5EA] dark:bg-[#3A3A3C] text-[#3C3C43] dark:text-[#EBEBF5] text-[13px] font-sf font-medium capitalize">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {exercise.instructions?.length > 0 && (
            <div>
              <h3 className="text-[13px] font-sf font-semibold text-[#8E8E93] uppercase tracking-wide px-1 mb-2">
                Instructions
              </h3>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios-sm divide-y divide-[#C6C6C8]/25 dark:divide-[#38383A]/60">
                {exercise.instructions.map((step, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3">
                    <span className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-ios-blue text-white text-[12px] font-sf font-bold flex-shrink-0 mt-[1px]">
                      {i + 1}
                    </span>
                    <p className="text-[15px] font-sf text-black dark:text-white leading-snug">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
