import {
  CHEAT_REROLL_PROBABILITY_HIGH,
  CHEAT_REROLL_PROBABILITY_MEDIUM,
  CHEAT_THRESHOLD_HIGH,
  CHEAT_THRESHOLD_LOW,
  ROLL_COST,
  SYMBOL_PAYOUT,
  REEL_LENGTH,
} from './game.constants';
import type { RandomFn, RollResult, Symbol } from './game.types';
import { SYMBOLS } from './game.types';

export function generateRandomSymbol(random: RandomFn): Symbol {
  const index = Math.floor(random() * SYMBOLS.length);
  return SYMBOLS[index];
}

export function generateRoll(random: RandomFn = Math.random): Symbol[] {
  const symbols: Symbol[] = [];

  for (let i = 0; i < REEL_LENGTH; i += 1) {
    symbols.push(generateRandomSymbol(random));
  }

  return symbols;
}

export function isWinningRoll(symbols: Symbol[]): boolean {
  if (symbols.length === 0) {
    return false;
  }

  const [first, ...rest] = symbols;
  return rest.every((symbol) => symbol === first);
}

export function calculateWinAmount(symbols: Symbol[]): number {
  if (!isWinningRoll(symbols)) {
    return 0;
  }

  const [symbol] = symbols;
  return SYMBOL_PAYOUT[symbol];
}

function getCheatProbability(creditsBeforeRoll: number): number {
  if (
    creditsBeforeRoll >= CHEAT_THRESHOLD_LOW &&
    creditsBeforeRoll < CHEAT_THRESHOLD_HIGH
  ) {
    return CHEAT_REROLL_PROBABILITY_MEDIUM;
  }

  if (creditsBeforeRoll >= CHEAT_THRESHOLD_HIGH) {
    return CHEAT_REROLL_PROBABILITY_HIGH;
  }

  return 0;
}

export function applyCheatingIfNeeded(
  initialSymbols: Symbol[],
  creditsBeforeRoll: number,
  random: RandomFn = Math.random,
): Symbol[] {
  const cheatProbability = getCheatProbability(creditsBeforeRoll);

  if (cheatProbability === 0) {
    return initialSymbols;
  }

  const isWinning = isWinningRoll(initialSymbols);
  if (!isWinning) {
    return initialSymbols;
  }

  const chance = random();
  if (chance >= cheatProbability) {
    return initialSymbols;
  }

  return generateRoll(random);
}

export function performRoll(
  creditsBeforeRoll: number,
  random: RandomFn = Math.random,
): RollResult {
  const baseSymbols = generateRoll(random);
  const maybeCheatedSymbols = applyCheatingIfNeeded(
    baseSymbols,
    creditsBeforeRoll,
    random,
  );
  const winAmount = calculateWinAmount(maybeCheatedSymbols);
  const creditsAfterRoll = creditsBeforeRoll - ROLL_COST + winAmount;

  return {
    symbols: maybeCheatedSymbols,
    winAmount,
    credits: creditsAfterRoll,
  };
}

