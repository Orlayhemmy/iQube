import { model, Document, Schema } from 'mongoose';
import { Interface } from 'readline';

export interface Device extends Document {
  deviceID: string;
  deviceName: String;
  deviceOS: String;
}

const deviceSchema: Schema = new Schema(
  {
    deviceID: String,
    deviceName: String,
    deviceOS: String,
    userID: String
  },
  { timestamps: true }
);

export default model('Device', deviceSchema);
