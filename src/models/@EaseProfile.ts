import { model, Document, Schema } from 'mongoose';
import { Device } from './Device';

export interface UserAtEase extends Document {
  userID: string;
  profilePicture: string;
  deviceID: string;
  deviceName: string;
  deviceOS: string;
}

const userSchema = new Schema(
  {
    userID: { type: String, index: true },
    profilePicture: { type: String, default: '' },
    deviceID: String,
    deviceName: String,
    deviceOS: String
  },
  { timestamps: true }
);

export default model<UserAtEase>('UserAtEase', userSchema);
