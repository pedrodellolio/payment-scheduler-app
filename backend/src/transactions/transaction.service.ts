import { Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Connection, Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectModel(Transaction.name) private model: Model<Transaction>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(userId: Types.ObjectId): Promise<Transaction[]> {
    const transactions = await this.model.find({ user: userId }).lean().exec();
    return transactions.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));
  }

  async create(dto: CreateTransactionDto, userId: Types.ObjectId) {
    const nextPaymentDate =
      dto.frequency &&
      this.calculateNextPaymentDate(dto.occurredAt, dto.frequency);

    const createdTransaction = new this.model({
      ...dto,
      nextPaymentDate,
      user: userId,
    });
    return createdTransaction.save();
  }

  async delete(
    id: string,
    userId: Types.ObjectId,
  ): Promise<{ deleted: boolean }> {
    const result = await this.model.deleteOne({
      _id: id,
      user: userId,
    });
    return { deleted: result.deletedCount > 0 };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'handleRecurringPayments',
    waitForCompletion: true,
  })
  async handleRecurringPayments() {
    // const session = await this.connection.startSession();
    // session.startTransaction();

    try {
      const today = new Date();
      const paymentsDue = await this.model.find(
        { nextPaymentDate: { $lte: today } },
        // null,
        // { session },
      );
      for (const payment of paymentsDue) {
        const newTransaction = new this.model({
          title: payment.title,
          valueBrl: payment.valueBrl,
          occurredAt: today,
          frequency: payment.frequency,
          nextPaymentDate: this.calculateNextPaymentDate(
            payment.nextPaymentDate || today,
            payment.frequency ?? 'monthly',
          ),
          remainingInstallments: payment.remainingInstallments
            ? payment.remainingInstallments - 1
            : undefined,
          numberOfInstallments: payment.numberOfInstallments,
          status: 'paid',
          user: payment.user,
          originalTransaction: payment.originalTransaction || payment._id,
        });

        await newTransaction
          .save
          // { session }
          ();
        this.logger.log(`Processed payment for user ${payment.user}`);
      }
      // await session.commitTransaction();
    } catch (error) {
      // await session.abortTransaction();
      this.logger.error(
        `Failed to process recurring payments: ${error.message}`,
      );
    }
    // finally {
    //   session.endSession();
    // }
  }

  private calculateNextPaymentDate(currentDate: Date, frequency: string): Date {
    const nextDate = new Date(currentDate);
    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        throw new Error(`Unsupported frequency: ${frequency}`);
    }
    return nextDate;
  }
}
