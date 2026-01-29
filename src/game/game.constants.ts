import type { Symbol } from './game.types';
import { SYMBOLS } from './game.types';

export const INITIAL_CREDITS = 10;
export const ROLL_COST = 1;

export const CHEAT_THRESHOLD_LOW = 40;
export const CHEAT_THRESHOLD_HIGH = 60;

export const CHEAT_REROLL_PROBABILITY_MEDIUM = 0.3; // 30%
export const CHEAT_REROLL_PROBABILITY_HIGH = 0.6; // 60%

export const REEL_LENGTH = 3;

export const SYMBOL_PAYOUT: Record<Symbol, number> = {
  C: 10,
  L: 20,
  O: 30,
  W: 40,
  N: 40,
};

