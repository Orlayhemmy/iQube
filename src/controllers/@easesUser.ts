import { Request, Response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';
import * as rp from 'request-promise-native';
const baseUrl = `https://stanbic.nibse.com/mybank/api`;
let initiateOTPURL = `${baseUrl}/UserProfileManagement/InitiateVBOTP`;
let validateOTPURL = `${baseUrl}/UserProfileManagement/ValidateVBOTP`;

async function initiateOTP(req: Request) {
  const data = {
    ReasonCode: '99',
    UserId: req.body.UserId,
    ReasonDescription: 'device binding'
  };

  const options = {
    method: 'POST',
    uri: initiateOTPURL,
    body: data,
    json: true,
    headers: {
      'content-type': 'application/json'
    }
  };
  return await rp(options);
}

export const bindDevice = async (req: Request, res: Response) => {
  try {
    let inputs = [
      'deviceName',
      'deviceID',
      'deviceOS',
      'OTP',
      'OTPReference',
      'UserId'
    ];
    let err = validator(inputs, req.body);
    if (err.length >= 1)
      return res.status(400).json({ status: 400, message: err });

    const data = {
      UserId: req.body.UserId,
      OTP: req.body.OTP,
      OTPReference: req.body.OTPReference
    };
    const options = {
      method: 'POST',
      uri: validateOTPURL,
      body: data,
      json: true,
      headers: {
        'content-type': 'application/json'
      }
    };
    let response = await rp(options);
    if (response.ResponseCode == '00') {
      let UserId = req.body.UserId;

      let user = await db.AtEaseUser.findOne({
        userID: UserId
      });
      if (!user) {
        // create user
        user = await db.AtEaseUser.create({
          userID: UserId
        });
      }
      // check that device is not binded to more than one profile(userId)
      const devices = await db.AtEaseDevice.find({
        deviceID: req.body.deviceID,
        isUnLinked: false
      });

      if (devices.length && devices.length >= 1) {
        return res.status(400).json({
          status: 400,
          message: `You already have 1 profile linked to this device, please unlink to add this`
        });
      }
      if (user.device.length < 1) {
        // add the device for the user in device Model
        //first find the device and check if it's been unlinked, else create it
        let device = await db.AtEaseDevice.findOne({
          deviceID: req.body.deviceID,
          user: user._id,
          isUnLinked: true
        });
        if (device) {
          device = await db.AtEaseDevice.findOneAndUpdate(
            { _id: device._id },
            { isUnLinked: false },
            { new: true }
          );
        }
        if (!device) {
          device = await db.AtEaseDevice.create({
            deviceName: req.body.deviceName,
            deviceID: req.body.deviceID,
            deviceOS: req.body.deviceOS,
            user: user._id
          });
        }
        // update the user model with the device id
        let updatingUserSchema = await db.AtEaseUser.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { device: device._id } },
          { new: true }
        );
        return res.status(200).json({
          status: 200,
          data: {
            device,
            updatingUserSchema,
            message: `Device successfully linked`
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
      .json({ status: 400, message: response.ResponseFriendlyMessage });
  } catch (e) {
    if (e.statusCode)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, message: e.message });
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    let inputs = ['UserId', 'deviceID'];
    let err = validator(inputs, req.body);
    if (err.length >= 1)
      return res.status(401).json({ status: 401, message: err });

    // first find user. if no user, they've not binded
    const user = await db.AtEaseUser.findOne({ userID: req.body.UserId });

    if (!user) {
      let response = await initiateOTP(req);
      if (response.ResponseCode != '00') {
        response = await initiateOTP(req);
      }
      return res.status(200).json({
        status: 202,
        message: `An otp has been sent to you for device binding`,
        OTPReference: response.Reference
      });
    }
    const userDevice = await db.AtEaseDevice.findOne({
      userID: req.body.UserId,
      deviceID: req.body.deviceID,
      isUnLinked: false
    });

    if (!userDevice) {
      let response = await initiateOTP(req);
      if (response.ResponseCode != '00') {
        response = await initiateOTP(req);
      }
      return res.status(200).json({
        status: 202,
        message: `An otp has been sent to you for device binding`,
        OTPReference: response.Reference
      });
    }

    return res
      .status(200)
      .json({ status: 200, message: `User device already linked` });
  } catch (e) {
    if (e.statusCode)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, message: e.message });
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const unlinkDevice = async (req: Request, res: Response) => {
  try {
    // validate otp
    let inputs = ['deviceID', 'OTP', 'OTPReference', 'UserId'];
    let err = validator(inputs, req.body);
    if (err.length >= 1)
      return res.status(400).json({ status: 400, message: err });

    const data = {
      UserId: req.body.UserId,
      OTP: req.body.OTP,
      OTPReference: req.body.OTPReference
    };
    const options = {
      method: 'POST',
      uri: validateOTPURL,
      body: data,
      json: true,
      headers: {
        'content-type': 'application/json'
      }
    };
    let response = await rp(options);

    if (response.ResponseCode == '00') {
      // find device and update status
      const user = await db.AtEaseUser.findOne({ userID: req.body.UserId });
      if (user) {
        const device = await db.AtEaseDevice.findOne({
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
        await db.AtEaseDevice.findOneAndUpdate(
          { _id: device._id },
          { isUnLinked: true },
          { new: true }
        );
        // unlink device from user's profile
        await db.AtEaseUser.findOneAndUpdate(
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
      message: response.ResponseFriendlyMessage
    });
  } catch (e) {
    if (e.statusCode)
      return res
        .status(e.statusCode)
        .json({ status: e.statusCode, message: e.message });
    return res.status(400).json({ status: 400, message: e.message });
  }
};

export const addOrUpdateProfileImage = async (req: Request, res: Response) => {
  if (!req.body.UserId)
    return res
      .status(400)
      .json({ status: 400, message: `Please enter UserId` });

  let image = req.body.image || '';
  // check if user exists
  const user = await db.AtEaseUser.findOne({ userID: req.body.UserId });
  if (!user) {
    await db.AtEaseUser.create({
      userID: req.body.UserId,
      profilePicture: image
    });
  } else {
    await db.AtEaseUser.findOneAndUpdate(
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
  if (!req.body.UserId)
    return res
      .status(400)
      .json({ status: 400, message: `Please enter UserId` });

  const user = await db.AtEaseUser.findOne({ userID: req.body.UserId });
  let image = user ? user.profilePicture : '';
  return res.status(200).json({ status: 200, data: { profilePicture: image } });
};
