import { model, Document, Schema } from 'mongoose';
import { Device } from './Device';

export interface Logs extends Document {
  userID: string;
  device: Device['_id'];
  status: string;
  AppVersion: string
}

const logSchema = new Schema(
  {
    userID: String,
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
    status: String,
    AppVersion: String
  },
  { timestamps: true }
);

export default model<Logs>('log', logSchema);
