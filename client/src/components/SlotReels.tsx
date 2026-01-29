import type { SlotSymbol } from "../types/api";

interface SlotReelsProps {
  readonly symbols: (SlotSymbol | "X")[];
}

export function SlotReels({ symbols }: SlotReelsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 80px)",
        gap: 12,
        marginBottom: 16,
      }}
    >
      {symbols.map((symbol, index) => (
        <div
          key={index}
          style={{
            height: 80,
            borderRadius: 8,
            border: "2px solid #111",
            display: "grid",
            placeItems: "center",
            fontSize: 36,
            fontWeight: 600,
            backgroundColor: "#ffffff",
          }}
          data-testid={`reel-${index}`}
        >
          {symbol}
        </div>
      ))}
    </div>
  );
}
