import { memo } from "react";

interface StatusBarProps {
  readonly credits: number;
  readonly isSessionClosed: boolean;
  readonly error: string | null;
}

function StatusBar({ credits, isSessionClosed, error }: StatusBarProps) {
  return (
    <div className="StatusBar">
      <div className="StatusBar-credits">
        <span className="StatusBar-label">Credits:</span>
        <span className="StatusBar-value">{credits}</span>
      </div>
      {isSessionClosed && (
        <div className="StatusBar-closed">Session closed</div>
      )}
      {error && (
        <div className="StatusBar-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default memo(StatusBar);
