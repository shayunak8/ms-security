import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { INITIAL_CREDITS } from './game.constants';
import type { RollResult, Session, SessionStatus } from './game.types';
import { performRoll } from './game.logic';

interface MutableSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: SessionStatus;
  credits: number;
}

@Injectable()
export class GameService {
  private readonly sessions = new Map<string, MutableSession>();

  createSession(): Session {
    const now = new Date();
    const session: MutableSession = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'open',
      credits: INITIAL_CREDITS,
    };

    this.sessions.set(session.id, session);

    return { ...session };
  }

  getSession(sessionId: string): Session {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return { ...session };
  }

  private getOpenSessionOrThrow(sessionId: string): MutableSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'open') {
      throw new BadRequestException('Session is closed');
    }

    return session;
  }

  roll(sessionId: string): RollResult {
    const session = this.getOpenSessionOrThrow(sessionId);

    if (session.credits < 1) {
      throw new BadRequestException('Insufficient credits');
    }

    const result = performRoll(session.credits);

    session.credits = result.credits;
    session.updatedAt = new Date();

    return result;
  }

  cashout(sessionId: string): { finalCredits: number; status: SessionStatus } {
    const session = this.getOpenSessionOrThrow(sessionId);
    session.status = 'closed';
    session.updatedAt = new Date();

    return {
      finalCredits: session.credits,
      status: session.status,
    };
  }
}

