import { IsUUID } from 'class-validator';

export class RollDto {
  @IsUUID()
  sessionId!: string;
}

