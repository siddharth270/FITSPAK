import { Home, CalendarDays, ChartNoAxesCombined } from "lucide-react";
import { useApp } from "../context/AppContext";

const tabs = [
  { id: "home", icon: Home, label: "Home" },
  { id: "routines", icon: CalendarDays, label: "Routines" },
  { id: "profile", icon: ChartNoAxesCombined, label: "Stats" },
];

export default function BottomNav() {
  const { tab, setTab } = useApp();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50
        bg-white/80 dark:bg-[#1C1C1E]/80
        backdrop-blur-2xl
        border-t border-[#C6C6C8]/40 dark:border-[#38383A]/60
        bottom-safe pt-1.5 flex justify-around"
    >
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex flex-col items-center gap-[2px] px-4 py-1 min-w-[64px]"
          >
            <t.icon
              size={24}
              strokeWidth={active ? 2.2 : 1.5}
              className={`transition-colors ${
                active ? "text-ios-blue" : "text-[#8E8E93]"
              }`}
            />
            <span
              className={`text-[10px] font-sf ${
                active
                  ? "text-ios-blue font-semibold"
                  : "text-[#8E8E93] font-medium"
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
