import { model, Document, Schema } from 'mongoose';
import { Device } from './Device';

export interface UserAtEase extends Document {
  userID: string;
  profilePicture: string;
  device: [Device['_id']];
}

const userSchema = new Schema(
  {
    userID: { type: String, index: true },
    profilePicture: { type: String, default: '' },
    device: [{ type: Schema.Types.ObjectId, ref: 'AtEaseDevice' }]
  },
  { timestamps: true }
);

userSchema.index({ userID: 'text' });
export default model<UserAtEase>('UserAtEase', userSchema);
