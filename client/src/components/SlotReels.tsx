import './SlotReels.css';
import type { SlotSymbol } from '../types/api';

interface SlotReelsProps {
  readonly symbols: (SlotSymbol | "X")[];
}

export function SlotReels({ symbols }: SlotReelsProps) {
  return (
    <div className="SlotReels">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className={`SlotReel ${symbol === "X" ? "SlotReel--spinning" : ""}`}
          data-testid={`reel-${index}`}
        >
          {symbol}
        </div>
      ))}
    </div>
  );
}
