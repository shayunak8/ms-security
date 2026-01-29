import "./App.css";
import { Controls } from "./components/Controls";
import { SlotReels } from "./components/SlotReels";
import { StatusBar } from "./components/StatusBar";
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

        <StatusBar
          credits={credits}
          isSessionClosed={isSessionClosed}
          error={error}
        />

        <SlotReels symbols={symbols} />

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
