import { model, Document, Schema } from 'mongoose';

export interface Device extends Document {
  deviceID: string;
  deviceName: String;
  deviceOS: String;
  userID: String;
}

const deviceSchema: Schema = new Schema(
  {
    deviceID: String,
    deviceName: String,
    deviceOS: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default model<Device>('Device', deviceSchema);
