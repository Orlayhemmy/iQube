import { model, Document, Schema } from 'mongoose';

export interface Beneficiary extends Document {
  beneficiaryId: string;
  userId: string;
  image: string;
}

const BeneficiarySchema: Schema = new Schema(
  {
    beneficiaryId: { type: String, index: true },
    userId: { type: String, index: true },
    image: String
  },
  { timestamps: true }
);

export default model<Beneficiary>('Beneficiary', BeneficiarySchema);
