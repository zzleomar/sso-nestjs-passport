import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  status: boolean;

  @Prop({ default: false })
  code: string;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
