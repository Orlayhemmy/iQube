import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  keepAlive: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

mongoose.connect(`${process.env.MONGO_URI_STAGING}`, options);

mongoose.set('debug', true);

mongoose.connection.on('err', (err) => {
  console.error(console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`));
});

export { default as Device } from './Device';
export { default as UserDevice } from './UserDevice';
export { default as User } from './User';
export { default as Log } from './Log';
export { default as Beneficiary } from './Beneficiary';
export { default as AtEaseUser } from './@EaseProfile';
export { default as Advert } from './Advert';
export { default as AtEaseDevice } from './@EaseDevice';
export { default as Message } from './PushMessages';