import { model, Document, Schema } from 'mongoose';

export interface Advert extends Document {
  advertImage: string;
  module: string;
  text: string;
  link: string;
  title: string;
}

const advertSchema: Schema = new Schema(
  {
    advertImage: String,
    module: String,
    text: String,
    link: String,
    title: String
  },
  { timestamps: true }
);

export default model<Advert>('Advert', advertSchema);
