import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  valueBrl: number;

  @Prop({ type: Date, required: true })
  occurredAt: Date;

  @Prop({ required: true })
  isRecurrent: boolean;

  @Prop({ required: false })
  numberOfInstallments?: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
