import "./App.css";
import { lazy, Suspense } from "react";
import Controls from "./components/Controls";
const SlotReels = lazy(() => import("./components/SlotReels"));
const StatusBar = lazy(() => import("./components/StatusBar"));
import { useSlotMachine } from "./hooks/useSlotMachine";

function App() {
  const {
    sessionId,
    credits,
    symbols,
    isRolling,
    isSessionClosed,
    isLoadingSession,
    error,
    startSession,
    rollOnce,
    cashoutSession,
  } = useSlotMachine();

  return (
    <div className="App">
      <main className="App-main">
        <h1 className="App-title">Casino Jackpot</h1>

        <Suspense
          fallback={
            <div className="StatusBar-placeholder">Loading status…</div>
          }
        >
          <StatusBar
            credits={credits}
            isSessionClosed={isSessionClosed}
            error={error}
          />
        </Suspense>

        <Suspense
          fallback={<div className="SlotReels-placeholder">Loading reels…</div>}
        >
          <SlotReels symbols={symbols} />
        </Suspense>

        <Controls
          onStart={startSession}
          onRoll={rollOnce}
          onCashout={cashoutSession}
          isLoadingSession={isLoadingSession}
          isRolling={isRolling}
          hasSession={sessionId !== null}
          isSessionClosed={isSessionClosed}
        />
      </main>
    </div>
  );
}

export default App;
