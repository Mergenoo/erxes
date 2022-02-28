import { Document, Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';

export interface IEmailTemplate {
  name: string;
  content: string;
  status: string;
}

export interface IEmailTemplateDocument extends IEmailTemplate, Document {
  _id: string;
}

export const emailTemplateSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Name' }),
    status: field({ type: String, label: 'Status' }),
    content: field({ type: String, optional: true, label: 'Content' })
  })
);
