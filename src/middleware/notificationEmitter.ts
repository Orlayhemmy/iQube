const notificationServiceUrl = `https://stanbic-pushnotification.nibse.com`;
import { notificationEmitter } from '../controllers/user';
import * as db from '../models';
import * as rp from 'request-promise-native';

notificationEmitter.on(
  'notification',
  async (platform, deviceID, userID, token, module, FirstName, LastName, userDeviceID) => {
    try {
      const data = {
        key: 'LhUdxDyJoyw8GL9Qmx35PJKKByWagGCa',
        platform,
        deviceID,
        userID,
        token,
        module,
      };
      const options = {
        method: 'POST',
        uri: `${notificationServiceUrl}/device/sync`,
        body: data,
        json: true,
        headers: {
          'content-type': 'application/json',
        },
      };
      let response = await rp(options);
      console.log('response from device/sync', response);
      await db.Device.findOneAndUpdate(
        { _id: userDeviceID },
        {
          $set: {
            deviceNotificationToken: token,
          },
        },
        { new: true }
      );

      let isFirstLogin: boolean = false;
      let firstLoginDate: Date = new Date();
      // check if it's first login
      let firstLoginExists = await db.Log.findOne({
        userID,
        isFirstLogin: true,
      });
      if (!firstLoginExists) {
        isFirstLogin = true;
      } else {
        firstLoginDate = firstLoginExists.firstLoginDate;
      }
      // update user FirstName and LastName
      if (FirstName && LastName) {
        await db.User.findOneAndUpdate(
          { userID },
          { FirstName, LastName, firstLoginDate, lastLoginDate: new Date() }
        );
      } else {
        await db.User.findOneAndUpdate({ userID }, { firstLoginDate, lastLoginDate: new Date() });
      }

      const log = await db.Log.create({
        userID,
        device: userDeviceID,
        status: 'successful',
        isFirstLogin,
        firstLoginDate,
        lastLoginDate: new Date(),
      });
      return;
    } catch (e) {
      console.log('device notification error', e);
    }
  }
);
