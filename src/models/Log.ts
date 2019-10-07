import { model, Document, Schema } from 'mongoose';
import { Device } from './Device';

export interface Logs extends Document {
  userID: string;
  device: Device['_id'];
  status: string;
  AppVersion: string;
  firstLoginDate: Date; // first login date
  isFirstLogin: boolean
  lastLoginDate: Date;
}

const logSchema = new Schema(
  {
    userID: { type: String, index: true },
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
    status: String,
    firstLoginDate: Date, // first login date
    isFirstLogin: { type: Boolean, default: false },
    lastLoginDate: Date,
    AppVersion: String
  },
  { timestamps: true }
);

export default model<Logs>('log', logSchema);
