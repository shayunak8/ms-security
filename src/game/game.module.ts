import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { defaultRandomFn, RANDOM_FN } from './game.di';

@Module({
  controllers: [GameController],
  providers: [
    { provide: RANDOM_FN, useValue: defaultRandomFn },
    GameService,
  ],
})
export class GameModule {}

