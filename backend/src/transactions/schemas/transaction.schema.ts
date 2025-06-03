import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ required: true, set: (val: string) => val.toUpperCase() })
  title: string;

  @Prop({ required: true })
  valueBrl: number;

  @Prop({ type: Date, required: true })
  occurredAt: Date;

  @Prop()
  frequency?: 'yearly' | 'monthly' | 'weekly' | 'daily';

  @Prop()
  nextPaymentDate?: Date;

  @Prop()
  remainingInstallments?: number;

  @Prop()
  numberOfInstallments?: number;

  @Prop({ default: 'paid' })
  status: 'pending' | 'paid';

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Transaction' })
  originalTransaction?: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
