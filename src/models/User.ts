import { model, Document, Schema } from 'mongoose';
import { Device } from './Device';

export interface User extends Document {
  userID: string;
  profilePicture: string;
  device: [Device['_id']];
  FirstName: string;
  LastName: string;
  hasDataPolicyChecked: boolean;
}

const userSchema = new Schema(
  {
    userID: { type: String, index: true },
    profilePicture: { type: String, default: '' },
    device: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    FirstName: { type: String, default: '' },
    LastName: { type: String, default: '' },
    hasDataPolicyChecked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.index({ userID: 'text' });
export default model<User>('User', userSchema);
