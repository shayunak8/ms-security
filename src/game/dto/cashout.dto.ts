import { IsUUID } from 'class-validator';

export class CashoutDto {
  @IsUUID()
  sessionId!: string;
}

