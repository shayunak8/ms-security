import {
  applyCheatingIfNeeded,
  calculateWinAmount,
  generateRoll,
  isWinningRoll,
  performRoll,
} from './game.logic';
import { SYMBOLS } from './game.types';
import { CHEAT_THRESHOLD_LOW, CHEAT_THRESHOLD_HIGH, ROLL_COST } from './game.constants';

function createDeterministicRandom(sequence: number[]): () => number {
  let index = 0;
  return () => {
    const value = sequence[index % sequence.length]!;
    index += 1;
    return value;
  };
}

describe('game logic', () => {
  it('generateRoll should produce reels of correct length with allowed symbols', () => {
    const roll = generateRoll(() => 0);
    expect(roll).toHaveLength(3);
    roll.forEach((symbol) => {
      expect(SYMBOLS).toContain(symbol);
    });
  });

  it('generateRoll should produce different rolls for different random inputs', () => {
    const rollA = generateRoll(createDeterministicRandom([0, 0.1, 0.2]));
    const rollB = generateRoll(createDeterministicRandom([0.3, 0.4, 0.5]));

    expect(rollA).not.toEqual(rollB);
  });

  it('isWinningRoll detects winning and losing combinations correctly', () => {
    expect(isWinningRoll(['C', 'C', 'C'])).toBe(true);
    expect(isWinningRoll(['C', 'L', 'C'])).toBe(false);
    expect(isWinningRoll([])).toBe(false);
  });

  it('calculateWinAmount returns 0 for losing roll', () => {
    expect(calculateWinAmount(['C', 'L', 'C'])).toBe(0);
  });

  it('calculateWinAmount returns symbol-based payout for winning roll', () => {
    const winningSymbol = SYMBOLS[0]!;
    const roll = [winningSymbol, winningSymbol, winningSymbol];
    const winAmount = calculateWinAmount(roll);
    expect(winAmount).toBeGreaterThan(0);
  });

  it('applyCheatingIfNeeded does not change losing rolls regardless of credits', () => {
    const original = ['C', 'L', 'C'] as const;
    const resultLowCredits = applyCheatingIfNeeded([...original], 10, () => 0);
    const resultHighCredits = applyCheatingIfNeeded([...original], 100, () => 0);

    expect(resultLowCredits).toEqual(original);
    expect(resultHighCredits).toEqual(original);
  });

  it('applyCheatingIfNeeded keeps winning rolls when below cheating threshold', () => {
    const winning = ['C', 'C', 'C'] as const;
    const result = applyCheatingIfNeeded([...winning], CHEAT_THRESHOLD_LOW - 1, () => 0);
    expect(result).toEqual(winning);
  });

  it('applyCheatingIfNeeded can re-roll winning results in medium cheating range', () => {
    const winning = ['C', 'C', 'C'] as const;
    // First random() call is for cheating probability check, second onwards for reroll symbols
    const deterministicRandom = createDeterministicRandom([0, 0.2, 0.4, 0.6]);
    const result = applyCheatingIfNeeded([...winning], CHEAT_THRESHOLD_LOW, deterministicRandom);
    expect(result).not.toEqual(winning);
  });

  it('performRoll deducts roll cost and adds winnings', () => {
    const initialCredits = 50;
    const random = createDeterministicRandom([0, 0, 0]);

    const result = performRoll(initialCredits, random);

    expect(result.credits).toBeGreaterThanOrEqual(initialCredits - ROLL_COST);
  });

  it('performRoll respects cheating logic when credits are high', () => {
    const initialCredits = CHEAT_THRESHOLD_HIGH;
    const winningRoll = ['C', 'C', 'C'] as const;

    const randomValues: number[] = [];
    const random: () => number = () => {
      // First three calls generate the base winning roll
      if (randomValues.length < 3) {
        randomValues.push(0);
        return 0;
      }
      // Fourth call is the cheating probability – force cheating to happen
      if (randomValues.length === 3) {
        randomValues.push(0);
        return 0;
      }
      // Remaining calls generate a different roll
      randomValues.push(0.9);
      return 0.9;
    };

    const result = performRoll(initialCredits, random);

    expect(result.symbols).not.toEqual(winningRoll);
  });
});

