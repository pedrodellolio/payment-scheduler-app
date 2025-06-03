import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, set: (val: string) => val.toUpperCase() })
  firstName: string;

  @Prop({ required: true, set: (val: string) => val.toUpperCase() })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    set: (val: string) => val.toUpperCase(),
  })
  email: string;

  @Prop({ required: true })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
