import { model, Document, Schema } from 'mongoose';
import { Device } from './Device';

export interface User extends Document {
  userID: string;
  profilePicture: string;
  device: [Device['_id']];
  FirstName: string;
  LastName: string;
}

const userSchema = new Schema(
  {
    userID: { type: String, index: true },
    profilePicture: { type: String, default: '' },
    device: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    FirstName: { type: String, default: '' },
    LastName: { type: String, default: '' }
  },
  { timestamps: true }
);

userSchema.index({ userID: 'text' });
export default model<User>('User', userSchema);
