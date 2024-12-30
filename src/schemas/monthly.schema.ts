// month.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import  toMonthWords  from '../../utils/toMonthWords';

export type MonthDocument = Monthly & Document;

@Schema()
export class Monthly {
    @Prop({ required: true, default: 0 })
    spent: number;

    @Prop({ default: 0 })
    limit: number;

    @Prop({ default: 0 })
    entertainment: number;

    @Prop({ default: 0 })
    rent: number;

    @Prop({ default: 0 })
    food: number;

    @Prop({ default: 0 })
    transport: number;

    @Prop({ default: 0 })
    emi: number;

    @Prop({ default: 0 })
    shopping: number;

    @Prop({ default: 0 })
    hospital: number;

    @Prop({ default: 0 })
    school: number;

    @Prop({ default: 0 })
    fees: number;

    @Prop({ default: 0 })
    savings: number;

    @Prop({ default: 0 })
    other: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    uid: mongoose.Types.ObjectId;

    @Prop({ default: () => toMonthWords(new Date().getMonth()) + new Date().getFullYear() })
    month: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const MonthlySchema = SchemaFactory.createForClass(Monthly);
