import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GameService } from './game.service';
import { INITIAL_CREDITS } from './game.constants';

function createDeterministicRandom(sequence: number[]): () => number {
  let index = 0;
  return () => {
    const value = sequence[index % sequence.length]!;
    index += 1;
    return value;
  };
}

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    // Default: a deterministic random that produces a losing pattern: C, L, O
    service = new GameService(createDeterministicRandom([0, 0.34, 0.67]));
  });

  it('creates a new session with initial credits', () => {
    const session = service.createSession();

    expect(session.id).toBeDefined();
    expect(session.credits).toBe(INITIAL_CREDITS);
    expect(session.status).toBe('open');
  });

  it('allows rolling within an open session and updates credits', () => {
    const session = service.createSession();
    const beforeCredits = session.credits;

    const result = service.roll(session.id);
    // Losing pattern => -1 credit after roll
    expect(result.credits).toBe(beforeCredits - 1);
  });

  it('prevents rolling with insufficient credits', () => {
    const session = service.createSession();

    // Drain credits deterministically to 0 (always losing)
    for (let i = 0; i < INITIAL_CREDITS; i += 1) {
      service.roll(session.id);
    }

    expect(() => service.roll(session.id)).toThrow(BadRequestException);
  });

  it('closes a session on cashout and prevents further rolls', () => {
    const session = service.createSession();
    const cashout = service.cashout(session.id);

    expect(cashout.status).toBe('closed');
    expect(cashout.finalCredits).toBeGreaterThanOrEqual(0);

    expect(() => service.roll(session.id)).toThrow(BadRequestException);
  });

  it('throws when accessing a non-existent session', () => {
    expect(() => service.getSession('unknown')).toThrow(NotFoundException);
    expect(() => service.roll('unknown')).toThrow(NotFoundException);
    expect(() => service.cashout('unknown')).toThrow(NotFoundException);
  });
});

