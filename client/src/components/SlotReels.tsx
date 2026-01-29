import { memo } from "react";
import "./SlotReels.css";
import type { SlotSymbol } from "../types/api";

interface SlotReelsProps {
  readonly symbols: (SlotSymbol | "X")[];
}

const FRUIT_IMAGE_BY_SYMBOL: Record<SlotSymbol, string> = {
  C: "/fruits/cherry.svg",
  L: "/fruits/lemon.svg",
  O: "/fruits/orange.svg",
  W: "/fruits/watermelon.svg",
};

const FRUIT_LABEL_BY_SYMBOL: Record<SlotSymbol, string> = {
  C: "Cherry",
  L: "Lemon",
  O: "Orange",
  W: "Watermelon",
};

function SlotReels({ symbols }: SlotReelsProps) {
  return (
    <div className="SlotReels">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className={`SlotReel ${symbol === "X" ? "SlotReel--spinning" : ""}`}
          data-testid={`reel-${index}`}
        >
          {symbol === "X" ? (
            <span className="SlotReel-placeholder">X</span>
          ) : (
            <img
              className="SlotReel-image"
              src={FRUIT_IMAGE_BY_SYMBOL[symbol]}
              alt={FRUIT_LABEL_BY_SYMBOL[symbol]}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default memo(SlotReels);
