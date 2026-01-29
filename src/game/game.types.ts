export const SYMBOLS = ['C', 'L', 'O', 'W'] as const;

export type Symbol = (typeof SYMBOLS)[number];

export type SessionStatus = 'open' | 'closed';

export interface Session {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: SessionStatus;
  readonly credits: number;
}

export interface RollResult {
  readonly symbols: Symbol[];
  readonly winAmount: number;
  readonly credits: number;
}

export type RandomFn = () => number;

