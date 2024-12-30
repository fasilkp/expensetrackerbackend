import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import toMonthWords from '../../utils/toMonthWords'; // Adjust the path as necessary

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true })
  uid: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  amount: string;

  @Prop({
    type: String,
    default: () => `${toMonthWords(new Date().getMonth())}${new Date().getFullYear()}`,
  })
  month: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
