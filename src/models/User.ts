import { model, Document, Schema } from 'mongoose';
import { Device } from './Device';

export interface User extends Document {
  userID: String;
  profilePicture: String;
  device: [Device['_id']];
}

const userSchema = new Schema({
  userID: String,
  profilePicture: String,
  device: [{ type: Schema.Types.ObjectId, ref: 'Device' }]
});

export default model<User>('User', userSchema);
