import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private model: Model<Transaction>,
  ) {}

  async findAll(userId: Types.ObjectId): Promise<Transaction[]> {
    return this.model.find({ user: userId }).exec();
  }

  async create(dto: CreateTransactionDto, userId: Types.ObjectId) {
    const createdTransaction = new this.model({ ...dto, user: userId });
    return createdTransaction.save();
  }
}
