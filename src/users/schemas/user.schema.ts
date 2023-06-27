import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  email: number;

  @Prop({ required: true, maxLength: 20 })
  password: string;

  @Prop()
  address: string;

  @Prop()
  createAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
