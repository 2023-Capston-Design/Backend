import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class mailvalidation {
  @Prop()
  token: string;

  @Prop({ type: Date, expires: '1h', default: Date.now })
  createdAt: Date;
}

export type MailValidationDocument = HydratedDocument<mailvalidation>;
export const MailValidationSchema =
  SchemaFactory.createForClass(mailvalidation);
