import { model, Document, Schema } from 'mongoose';

export interface Messages extends Document {
  userHasReadIt: boolean;
}

const messageSchema: Schema = new Schema({
  userID: { type: String, index: true },
  userHasReadIt: Boolean,
});

export default model<Messages>('Message', messageSchema, 'messages');
