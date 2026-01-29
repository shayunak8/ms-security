import "./Controls.css";

interface ControlsProps {
  readonly onStart: () => void;
  readonly onRoll: () => void;
  readonly onCashout: () => void;
  readonly isLoadingSession: boolean;
  readonly isRolling: boolean;
  readonly hasSession: boolean;
  readonly isSessionClosed: boolean;
}

export function Controls({
  onStart,
  onRoll,
  onCashout,
  isLoadingSession,
  isRolling,
  hasSession,
  isSessionClosed,
}: ControlsProps) {
  const canRoll = hasSession && !isRolling && !isSessionClosed;
  const canCashout = hasSession && !isRolling && !isSessionClosed;

  return (
    <div className="Controls">
      <button
        type="button"
        className="Controls-button Controls-button--primary"
        onClick={onStart}
        disabled={isLoadingSession || isRolling}
      >
        {isLoadingSession ? "Starting…" : "Start Game"}
      </button>
      <button
        type="button"
        className="Controls-button Controls-button--secondary"
        onClick={onRoll}
        disabled={!canRoll}
      >
        {isRolling ? "Rolling…" : "Roll"}
      </button>
      <button
        type="button"
        className="Controls-button Controls-button--accent"
        onClick={onCashout}
        disabled={!canCashout}
      >
        Cash Out
      </button>
    </div>
  );
}
