import { model, Document, Schema } from 'mongoose';
import { Device } from './Device';
import { UserDevice } from './UserDevice';

export interface User extends Document {
  userID: string;
  profilePicture: string;
  device: [Device['_id']];
  devices: [UserDevice['_id']];
  FirstName: string;
  LastName: string;
  hasDataPolicyChecked: boolean;
  firstLoginDate: Date; // first login date
  lastLoginDate: Date;
}

const userSchema = new Schema(
  {
    userID: { type: String, index: true },
    profilePicture: { type: String, default: '' },
    device: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    devices: [{ type: Schema.Types.ObjectId, ref: 'User_Device' }],
    FirstName: { type: String, default: '' },
    LastName: { type: String, default: '' },
    hasDataPolicyChecked: { type: Boolean, default: false },
    firstLoginDate: Date,
    lastLoginDate: Date,
    groups: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

userSchema.index({ userID: 'text' });
export default model<User>('User', userSchema);
