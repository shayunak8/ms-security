interface StatusBarProps {
  readonly credits: number;
  readonly lastWinAmount: number | null;
  readonly sessionId: string | null;
  readonly isSessionClosed: boolean;
  readonly error: string | null;
}

export function StatusBar({
  credits,
  lastWinAmount,
  sessionId,
  isSessionClosed,
  error,
}: StatusBarProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div>
        <strong>Session:</strong> {sessionId ?? '—'}
        {isSessionClosed ? ' (closed)' : ''}
      </div>
      <div>
        <strong>Credits:</strong> {credits}
      </div>
      <div>
        <strong>Last win:</strong> {lastWinAmount ?? '—'}
      </div>
      {error && (
        <div style={{ color: '#b00020', marginTop: 4 }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

