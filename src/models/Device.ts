import { model, Document, Schema } from 'mongoose';

export interface Device extends Document {
  deviceID: string;
  deviceName: string;
  deviceOS: string;
  userID: string;
  isUnlinked: boolean;
  deviceNotificationToken: string;
}

const deviceSchema: Schema = new Schema(
  {
    deviceID: String,
    deviceName: String,
    deviceOS: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    isUnLinked: { type: Boolean, default: false },
    deviceNotificationToken: String
  },
  { timestamps: true }
);

export default model<Device>('Device', deviceSchema);
