import { Request, Response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';
import * as rp from 'request-promise-native';
import { EDESTADDRREQ } from 'constants';
const baseUrl = `https://stanbic.nibse.com/mybank/api`;
const url = `${baseUrl}/UserProfileManagement/InitiateOTPRequest`;

async function initialOTP(req: Request) {
  const data = {
    UserId: req.body.userID,
    CifId: req.body.CifId
  };
  const options = {
    method: 'POST',
    uri: url,
    body: data,
    json: true,
    headers: {
      'content-type': 'application/json'
    }
  };
  return await rp(options);
}
/* 
  when a user logs in we first check that the device they're logging in
  with is binded, if not, we tell them to bind their device which will
  require them calling this endpoint below
*/

export const addOrUpdateProfileImage = async (req: Request, res: Response) => {
  if (!req.body.userID)
    return res
      .status(400)
      .json({ status: 400, message: `Please enter userID` });

  let image = req.body.image || '';
  // check if user exists
  const user = await db.User.findOne({ userID: req.body.userID });
  if (!user) {
    await db.User.create({ userID: req.body.userID });
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
    const validateOTPURL = `${baseUrl}/UserProfileManagement/ValidateOTP`;
    const data = {
      UserId: req.body.userID,
      Otp: req.body.Otp,
      Reference: req.body.Reference
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
    let response = await rp(options);
    // a device can be binded to five accounts
    // and you can have five accounts binded to one device
    if (response.ResponseCode == '00') {
      // find if user exists already
      let userID = req.body.userID;
      let deviceID = req.body.deviceID;

      let user = await db.User.findOne({ userID });
      if (!user) {
        // create user
        user = await db.User.create({ userID });
      }
      // find the user in the device Collection and make sure
      // their device's is not more than five
      // first make sure the device ID does not exist
      const foundDevice = await db.Device.findOne({
        deviceID: req.body.deviceID
      });
      if (foundDevice)
        return res.status(400).json({
          status: 400,
          message: `device already binded, please login`
        });

      const userDevices = await db.Device.find({ user: user._id });
      if (userDevices.length < 5) {
        // add the device for the user in device Model
        const device = await db.Device.create({
          deviceName: req.body.deviceName,
          deviceID: req.body.deviceID,
          deviceOS: req.body.deviceOS,
          user: user._id
        });
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
        message: `You already have 5 devices bounded to this account, please unbind one to add this`
      });
    }
    return res
      .status(400)
      .json({ status: 400, message: `Unable to validate OTP` });
  } catch (e) {
    return res
      .status(e.statusCode)
      .json({ status: e.statusCode, message: e.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    let inputs = ['deviceID', 'userID', 'CifId'];
    let err = validator(inputs, req.body);
    if (err.length >= 1)
      return res.status(401).json({ status: 401, message: err });

    // first find user. if no user, they've not binded
    const user = await db.User.findOne({ userID: req.body.userID });
    if (!user) {
      // initiate otp
      let response = await initialOTP(req);
      if (response.ResponseCode == '00') {
        return res.status(202).json({
          status: 202,
          message: `An otp has been sent to you for device binding`
        });
      }
      return res
        .status(401)
        .json({ status: 401, message: `Please bind this device to continue` });
    }
    const userDevices = await db.Device.findOne({
      user: user._id,
      deviceID: req.body.deviceID
    });

    if (!userDevices) {
      // initiate otp
      let response = await initialOTP(req);
      if (response.ResponseCode == '00') {
        return res.status(202).json({
          status: 202,
          message: `An otp has been sent to you for device binding`
        });
      }
      return res.status(401).json({
        status: 401,
        message: `Please bind this device to continue`
      });
    }

    const log = await db.Log.create({
      userID: req.body.userID,
      device: userDevices._id,
      status: 'successful'
    });

    return res.status(200).json({
      status: 200,
      message: `user device already successfully binded`,
      log
    });
  } catch (e) {
    return res
      .status(e.statusCode)
      .json({ status: e.statusCode, message: e.message });
  }
};

export const viewAllBindedDevices = async (req: Request, res: Response) => {
  let inputs = ['userID'];
  let err = validator(inputs, req.body);
  if (err.length >= 1)
    return res.status(400).json({ status: 400, message: err });

  const usersDevices = await db.User.findOne({
    userID: req.body.userID
  }).populate('device', 'device');

  if (usersDevices)
    return res.status(200).json({ status: 200, data: usersDevices });

  return res.status(400).json({
    status: 400,
    message: `You have no devices bounded to this account`
  });
};
