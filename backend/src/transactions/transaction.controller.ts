import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schemas/transaction.schema';
import { Types } from 'mongoose';
import { UserId } from 'src/auth/decorators/user.decorator';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getAll(@UserId() userId: Types.ObjectId): Promise<Transaction[]> {
    return this.transactionService.findAll(userId);
  }

  @Post()
  async create(
    @UserId() userId: Types.ObjectId,
    @Body() dto: CreateTransactionDto,
  ) {
    this.transactionService.create(dto, userId);
  }
}
