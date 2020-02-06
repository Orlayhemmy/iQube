import { Request, Response, response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';
import * as rp from 'request-promise-native';
// const baseUrl = `https://stanbic.nibse.com/mybank/api`;
const baseUrl = `https://ibankingpilot.stanbicibtcbank.com/api`;
const initiateOTPUrl = `${baseUrl}/UserProfileManagement/InitiateOTPRequest`;
const dataPolicyUrl = `${baseUrl}/UserProfileManagement/ConfirmIfUserDataPrivacyExist`;
const initiateDeviceBindingOTPURL = `${baseUrl}/UserProfileManagement/InitiateDeviceBindingOTP`;
const notificationServiceUrl = `https://stanbic-pushnotification.nibse.com`;
const validateOTPURL = `${baseUrl}/UserProfileManagement/ValidateDeviceBindingOTP`;

async function initiateOTPorCheckDataPolicy(req: Request, url: string) {
  let data: any = {
    UserId: req.body.userID,
    CifId: req.body.CifId
  };
  if (url === initiateDeviceBindingOTPURL) {
    data.ReasonCode = 20;
    data.ReasonDescription = 'Bind Device';
  }
  const options = {
    method: 'POST',
    uri: url,
    body: data,
    json: true,
    headers: {
      'content-type': 'application/json',
      'X-STC-AGENT-CACHE': req.body.userID,
      Authorization: `Bearer ${req.body.Token}`
    }
  };
  return await rp(options);
}

async function validateDeviceBindingOTP(req: Request, url: string) {
  const data = {
    UserId: req.body.userID,
    Otp: req.body.Otp,
    Reference: req.body.Reference,
    CifId: req.body.CifId
  };
  const options = {
    method: 'POST',
    uri: validateOTPURL,
    body: data,
    json: true,
    headers: {
      'content-type': 'application/json',
      'X-STC-AGENT-CACHE': req.body.userID,
      Authorization: `Bearer ${req.body.Token}`
    }
  };
  return await rp(options);
}

export const addOrUpdateProfileImage = async (req: Request, res: Response) => {
  if (!req.body.userID)
    return res
      .status(400)
      .json({ status: 400, message: `Please enter userID` });

  let image = req.body.image || '';
  // check if user exists
  const user = await db.User.findOne({ userID: req.body.userID });
  if (!user) {
    await db.User.create({ userID: req.body.userID, profilePicture: image });
  } else {
    await db.User.findOneAndUpdate(
      { _id: user.id },
      { $set: { profilePicture: image } },
      { new: true }
    );
  }

  return res
    .status(200)
    .json({ status: 200, message: `Image successfully added` });
};

export const fetchImage = async (req: Request, res: Response) => {
  if (!req.body.userID)
    return res
      .status(400)
      .json({ status: 400, message: `Please enter userID` });

  const user = await db.User.findOne({ userID: req.body.userID });
  let image = user ? user.profilePicture : '';
  return res.status(200).json({ status: 200, data: { profilePicture: image } });
};

export const deviceBinding = async (req: Request, res: Response) => {
  try {
    let inputs = [
      'deviceName',
      'deviceID',
      'deviceOS',
      'Otp',
      'Reference',
      'userID',
      'Token'
    ];
    let err = validator(inputs, req.body);
    if (err.length >= 1)
      return res.status(400).json({ status: 400, message: err });

    // validate otp
    let response = await validateDeviceBindingOTP(req, validateOTPURL);
    // a device can be binded to five accounts
    // and you can have five accounts binded to one device
    if (response.ResponseCode == '00') {
      // find if user exists already
      let userID = req.body.userID;
      let deviceID = req.body.deviceID;

      let user = await db.User.findOne({ userID });
      if (!user) {
        // create user
        user = await db.User.create({
          userID,
          FirstName: req.body.FirstName,
          LastName: req.body.LastName
        });
      }

      // check that device is not binded to more than five profiles(userId)
      const devices = await db.Device.find({
        deviceID: req.body.deviceID,
        isUnLinked: false
      });

      if (devices.length && devices.length >= 5) {
        return res.status(400).json({
          status: 400,
          message: `You already have 5 profiles bounded to this device, please unbind one to add this`
        });
      }

      // find the user in the device Collection and make sure
      // their device's is not more than five

      if (user.device.length < 5) {
        // add the device for the user in device Model

        //first find the device and check if it's been unlinked, else create it
        let device = await db.Device.findOne({
          deviceID: req.body.deviceID,
          user: user._id,
          isUnLinked: true
        });
        if (device) {
          device = await db.Device.findOneAndUpdate(
            { _id: device._id },
            { isUnLinked: false },
            { new: true }
          );
        }
        if (!device) {
          device = await db.Device.create({
            deviceName: req.body.deviceName,
            deviceID: req.body.deviceID,
            deviceOS: req.body.deviceOS,
            user: user._id
          });
        }
        // update the user model with the device id
        let updatingUserSchema = await db.User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { device: device._id } },
          { new: true }
        );
        return res.status(200).json({
          status: 200,
          data: {
            device,
            updatingUserSchema,
            message: `Device successfully binded`
          }
        });
      }
      return res.status(400).json({
        status: 400,
        message: `You already have 5 devices bounded to this account, please unlink one to add this`
      });
    }
    return res
      .status(400)
      .json({ status: 400, message: `Unable to validate OTP` });
  } catch (e) {
    if (e.statusCode)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, message: e.message });
    return res.status(400).json({ status: 400, message: e.message });
  }
};

/* 
  when a user logs in we first check that the device they're logging in
  with is binded, if not, we tell them to bind their device which will
  require them calling this endpoint below
*/
export const login = async (req: Request, res: Response) => {
  try {
    let inputs = ['deviceID', 'userID', 'CifId', 'Token'];
    let err = validator(inputs, req.body);
    if (err.length >= 1)
      return res.status(401).json({ status: 401, message: err });

    // first find user. if no user, they've not binded
    const user = await db.User.findOne({ userID: req.body.userID });

    // check data policy only when user has not done it
    if (user && !user.hasDataPolicyChecked) {
      // check if user has done data policy
      let dataPolicy = await initiateOTPorCheckDataPolicy(req, dataPolicyUrl);
      if (dataPolicy.ResponseCode == '70') {
        return res
          .status(200)
          .json({ status: 201, message: dataPolicy.ResponseFriendlyMessage });
      } else {
        await db.User.findOneAndUpdate(
          { _id: user._id },
          { hasDataPolicyChecked: true }
        );
      }
    }

    if (!user) {
      // initiate otp
      let response = await initiateOTPorCheckDataPolicy(
        req,
        initiateDeviceBindingOTPURL
      );
      if (response.ResponseCode != '00') {
        // try resending otp again
        response = await initiateOTPorCheckDataPolicy(
          req,
          initiateDeviceBindingOTPURL
        );
      }
      return res.status(200).json({
        status: 202,
        message: `An otp has been sent to you for device binding`,
        Reference: response.ResponseDescription
      });
    }
    const userDevices = await db.Device.findOne({
      user: user._id,
      deviceID: req.body.deviceID,
      isUnLinked: false
    });

    if (!userDevices) {
      // initiate otp
      let response = await initiateOTPorCheckDataPolicy(
        req,
        initiateDeviceBindingOTPURL
      );
      if (response.ResponseCode != '00') {
        // try resending otp again
        response = await initiateOTPorCheckDataPolicy(
          req,
          initiateDeviceBindingOTPURL
        );
      }
      return res.status(200).json({
        status: 202,
        message: `An otp has been sent to you for device binding`,
        Reference: response.ResponseDescription
      });
    }

    try {
      const data = {
        key: 'LhUdxDyJoyw8GL9Qmx35PJKKByWagGCa',
        platform: req.body.deviceOS ? req.body.deviceOS.toUpperCase() : '',
        deviceID: req.body.deviceID,
        userID: req.body.userID,
        token: req.body.deviceNotificationToken,
        module: 'mybank'
      };
      const options = {
        method: 'POST',
        uri: `${notificationServiceUrl}/device/sync`,
        body: data,
        json: true,
        headers: {
          'content-type': 'application/json'
        }
      };
      let response = await rp(options);
      await db.Device.findOneAndUpdate(
        { _id: userDevices._id },
        { $set: { deviceNotificationToken: req.body.deviceNotificationToken } },
        { new: true }
      );

      // update user FirstName and LastName
      if (req.body.FirstName && req.body.LastName) {
        await db.User.findOneAndUpdate(
          { userID: req.body.userID },
          { FirstName: req.body.FirstName, LastName: req.body.LastName }
        );
      }
    } catch (e) {
      console.log('device notification error', e);
    }
    let isFirstLogin: boolean = false;
    let firstLoginDate: Date = new Date();
    // check if it's first login
    let firstLoginExists = await db.Log.findOne({
      userID: req.body.userID,
      isFirstLogin: true
    });
    if (!firstLoginExists) {
      isFirstLogin = true;
    } else {
      firstLoginDate = firstLoginExists.firstLoginDate;
    }

    const log = await db.Log.create({
      userID: req.body.userID,
      device: userDevices._id,
      status: 'successful',
      isFirstLogin,
      firstLoginDate,
      lastLoginDate: new Date()
    });

    return res.status(200).json({
      status: 200,
      message: `user device already successfully binded`,
      log
    });
  } catch (e) {
    if (e.statusCode)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, message: e.message });
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const viewAllBindedDevices = async (req: Request, res: Response) => {
  let inputs = ['userID'];
  let err = validator(inputs, req.body);
  if (err.length >= 1)
    return res.status(400).json({ status: 400, message: err });

  const usersDevices = await db.User.findOne({
    userID: req.body.userID
  }).populate('device', 'deviceID deviceName deviceOS');

  if (usersDevices)
    return res.status(200).json({ status: 200, data: usersDevices });

  return res.status(400).json({
    status: 400,
    message: `You have no devices bounded to this account`
  });
};

export const sendOTPforUnLinkDevice = async (req: Request, res: Response) => {
  let inputs = ['userID', 'CifId', 'Token'];
  let err = validator(inputs, req.body);
  if (err.length >= 1)
    return res.status(401).json({
      status: 401,
      message: err
    });

  let response = await initiateOTPorCheckDataPolicy(
    req,
    initiateDeviceBindingOTPURL
  );
  if (response.ResponseCode != '00') {
    // try resending otp again
    await initiateOTPorCheckDataPolicy(req, initiateDeviceBindingOTPURL);
  }
  return res.status(200).json({
    status: 200,
    message: `An otp has been sent to you for device binding`
  });
};

export const unlinkDevice = async (req: Request, res: Response) => {
  try {
    // validate otp
    let inputs = ['deviceID', 'Otp', 'Reference', 'userID', 'Token'];
    let err = validator(inputs, req.body);
    if (err.length >= 1)
      return res.status(400).json({ status: 400, message: err });

    let response = await validateDeviceBindingOTP(req, validateOTPURL);

    if (response.ResponseCode == '00') {
      // find device and update status
      const user = await db.User.findOne({ userID: req.body.userID });
      if (user) {
        const device = await db.Device.findOne({
          deviceID: req.body.deviceID,
          user: user._id,
          isUnLinked: false
        });
        if (!device)
          return res.status(400).json({
            status: 400,
            message: `Could not unlink Device because it is not currently linked`
          });
        // unlink device from device account
        await db.Device.findOneAndUpdate(
          { _id: device._id },
          { isUnLinked: true },
          { new: true }
        );
        // unlink device from user's profile
        await db.User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { device: device._id } },
          { new: true }
        );
        return res
          .status(200)
          .json({ status: 200, message: 'Device successfully unlinked' });
      }
      return res.status(400).json({
        status: 400,
        message: `Could not unlink Device because it is not currently linked`
      });
    }
    return res.status(400).json({
      status: 400,
      message: `Could not validate OTP`
    });
  } catch (e) {
    if (e.statusCode)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, message: e.message });
    return res.status(400).json({ status: 400, message: e.message });
  }
};
