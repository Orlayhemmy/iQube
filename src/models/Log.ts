import { model, Document, Schema } from 'mongoose';
import { Device } from './Device';

export interface Logs extends Document {
  userID: String;
  deviceID: Device['_id'];
  status: String;
}

const logSchema = new Schema(
  {
    userID: String,
    deviceID: { type: Schema.Types.ObjectId, ref: 'Device' },
    status: String
  },
  { timestamps: true }
);

export default model<Logs>('log', logSchema);
