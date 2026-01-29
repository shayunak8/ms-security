export type SlotSymbol = 'C' | 'L' | 'O' | 'W';

export interface SessionResponse {
  readonly sessionId: string;
  readonly credits: number;
}

export interface RollResponse {
  readonly symbols: SlotSymbol[];
  readonly winAmount: number;
  readonly credits: number;
}

export interface CashoutResponse {
  readonly finalCredits: number;
  readonly status: 'closed';
}

