import { Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectModel(Transaction.name) private model: Model<Transaction>,
    // @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(userId: Types.ObjectId, groupByRecurrence: boolean = false) {
    const transactions = await this.model.find({ user: userId }).lean().exec();
    if (!groupByRecurrence) {
      return transactions.map(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toString(),
      }));
    }

    // Group by originalTransaction or self
    const latestByGroup = new Map<string, any>();

    for (const tx of transactions) {
      const groupId = tx.originalTransaction?.toString() || tx._id.toString();
      const existing = latestByGroup.get(groupId);
      if (
        !existing ||
        new Date(tx.occurredAt) > new Date(existing.occurredAt)
      ) {
        latestByGroup.set(groupId, tx);
      }
    }

    return Array.from(latestByGroup.values()).map(({ _id, ...rest }) => ({
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
      occurredAt: this.toUtcMidnight(dto.occurredAt),
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
    const today = new Date();

    try {
      const paymentsDue = await this.model
        .aggregate()
        .match({
          nextPaymentDate: { $lte: today },
        })
        // Check if there is any transaction referenced as originalTransaction
        .lookup({
          from: 'transactions',
          localField: '_id',
          foreignField: 'originalTransaction',
          as: 'children',
        })
        .match({ children: { $eq: [] } });

      for (const payment of paymentsDue) {
        this.logger.log(`Start processing payments for user ${payment.user}`);

        const nextRemaining =
          payment.remainingInstallments !== undefined
            ? payment.remainingInstallments - 1
            : undefined;

        if (
          payment.numberOfInstallments &&
          nextRemaining !== undefined &&
          nextRemaining < 0
        ) {
          this.logger.log(
            `No installments left for payment ${payment.originalTransaction ?? payment._id}`,
          );
          continue;
        }

        const lastDate = payment.nextPaymentDate || today;
        const freq = payment.frequency || 'monthly';
        const calculatedNextDate = this.calculateNextPaymentDate(
          lastDate,
          freq,
        );

        const newTransaction = new this.model({
          title: payment.title,
          valueBrl: payment.valueBrl,
          occurredAt: today,
          frequency: freq,
          nextPaymentDate: calculatedNextDate,
          remainingInstallments: nextRemaining,
          numberOfInstallments: payment.numberOfInstallments,
          status: 'paid',
          user: payment.user,
          originalTransaction: payment.originalTransaction ?? payment._id,
        });

        await newTransaction.save();
        this.logger.log(`Processed payment for user ${payment.user}`);
      }
    } catch (err) {
      this.logger.error(`Failed to process recurring payments: ${err.message}`);
    }
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
    return this.toUtcMidnight(nextDate);
  }

  private toUtcMidnight(date: Date | string): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0); // UTC midnight
    return d;
  }
}
