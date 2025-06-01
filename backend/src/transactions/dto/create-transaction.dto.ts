import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsNotEmpty()
  valueBrl: number;

  @Type(() => Date)
  @IsDate()
  occurredAt: Date;

  @IsBoolean()
  @IsNotEmpty()
  isRecurrent: boolean;

  @IsNumber()
  @IsPositive()
  numberOfInstallments?: number;

  frequency?: 'yearly' | 'monthly' | 'weekly' | 'daily';
}
