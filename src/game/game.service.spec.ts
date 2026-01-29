import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GameService } from './game.service';
import { INITIAL_CREDITS } from './game.constants';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    service = new GameService();
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
    expect(result.credits).toBeLessThanOrEqual(beforeCredits + 40); // upper bound with max payout
  });

  it('prevents rolling with insufficient credits', () => {
    const session = service.createSession();

    // Drain credits to 0
    while (true) {
      const current = service.getSession(session.id);
      if (current.credits <= 0) {
        break;
      }
      try {
        service.roll(session.id);
      } catch {
        break;
      }
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

