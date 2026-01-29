import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GameService } from './game.service';

interface SessionResponse {
  sessionId: string;
  credits: number;
}

interface RollRequestDto {
  sessionId: string;
}

interface RollResponse {
  symbols: string[];
  winAmount: number;
  credits: number;
}

interface CashoutRequestDto {
  sessionId: string;
}

interface CashoutResponse {
  finalCredits: number;
  status: string;
}

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('session')
  @HttpCode(HttpStatus.CREATED)
  createSession(): SessionResponse {
    const session = this.gameService.createSession();
    return {
      sessionId: session.id,
      credits: session.credits,
    };
  }

  @Post('roll')
  @HttpCode(HttpStatus.OK)
  roll(@Body() body: RollRequestDto): RollResponse {
    const result = this.gameService.roll(body.sessionId);
    return {
      symbols: result.symbols,
      winAmount: result.winAmount,
      credits: result.credits,
    };
  }

  @Post('cashout')
  @HttpCode(HttpStatus.OK)
  cashout(@Body() body: CashoutRequestDto): CashoutResponse {
    const result = this.gameService.cashout(body.sessionId);
    return {
      finalCredits: result.finalCredits,
      status: result.status,
    };
  }
}

