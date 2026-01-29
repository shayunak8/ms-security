import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CashoutDto } from './dto/cashout.dto';
import { RollDto } from './dto/roll.dto';
import type {
  SessionResponse,
  RollResponse,
  CashoutResponse,
} from './dto/game-response.dto';

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
  roll(@Body() body: RollDto): RollResponse {
    const result = this.gameService.roll(body.sessionId);
    return {
      symbols: result.symbols,
      winAmount: result.winAmount,
      credits: result.credits,
    };
  }

  @Post('cashout')
  @HttpCode(HttpStatus.OK)
  cashout(@Body() body: CashoutDto): CashoutResponse {
    const result = this.gameService.cashout(body.sessionId);
    return {
      finalCredits: result.finalCredits,
      status: result.status,
    };
  }
}

