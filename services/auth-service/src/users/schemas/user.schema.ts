import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  
  @Prop({ required: false })
  id?: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  birthday: Date;
  
  @Prop({ required: false })
  avatar?: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
