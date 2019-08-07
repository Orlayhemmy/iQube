import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'application.env' });

const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  keepAlive: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.connect(`${process.env.MONGODB_URI}`, options);

mongoose.connection.on('err', err => {
  console.error(console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`));
});

export { default as Device } from './Device';
export { default as User } from './User';
export { default as Log } from './Log';
