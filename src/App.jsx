import { useApp } from "./context/AppContext";
import BottomNav from "./components/BottomNav";
import SummaryModal from "./components/SummaryModal";
import HomePage from "./pages/HomePage";
import WorkoutSession from "./pages/WorkoutSession";
import RoutinePlanner from "./pages/RoutinePlanner";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const { loaded, tab, activeWorkout, showSummary } = useApp();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-ios-bg-grouped dark:bg-black">
        <div className="w-8 h-8 border-[3px] border-ios-blue/30 border-t-ios-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black text-black dark:text-white transition-colors duration-200 font-sf">
      {showSummary && <SummaryModal />}

      {activeWorkout ? (
        <WorkoutSession />
      ) : (
        <>
          <main className="pb-safe">
            {tab === "home" && <HomePage />}
            {tab === "routines" && <RoutinePlanner />}
            {tab === "profile" && <ProfilePage />}
          </main>
          <BottomNav />
        </>
      )}
    </div>
  );
}
