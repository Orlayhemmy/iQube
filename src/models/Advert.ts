import { model, Document, Schema } from 'mongoose';

export interface Advert extends Document {
  advertImage: string;
  module: string;
  text: string;
  link: string;
  title: string;
  mediaUrl: string;
  approved: boolean;
  status: boolean;
}

const advertSchema: Schema = new Schema(
  {
    advertImage: String,
    module: String,
    text: String,
    link: String,
    title: String,
    index: Number,
    mediaUrl: String,
    approved: Boolean,
    status: Boolean
  },
  { timestamps: true }
);

export default model<Advert>('Adverts', advertSchema);
