import { model, Document, Schema } from 'mongoose';

export interface UserDevice extends Document {
    deviceID: string;
    deviceName: string;
    deviceOS: string;
    userID: object;
    isUnlinked: boolean;
    deviceNotificationToken: string;
}

const deviceSchema: Schema = new Schema(
    {
        deviceID: String,
        deviceName: String,
        deviceOS: String,
        user: {
            regular: {
                type: Schema.Types.ObjectId, ref: 'User'
            },
            sme: {
                type: Schema.Types.ObjectId, ref: 'User'
            },
        },
        deviceNotificationToken: String
    },
    { timestamps: true }
);

export default model<UserDevice>('User_Device', deviceSchema);
