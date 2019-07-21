import { Request, Response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';

/* 
  when a user logs in we first check that they the device they're logging in
  with is binded, if not, we tell them to bind their device which will
  require them calling this endpoint below
*/

export const deviceBinding = async (req: Request, res: Response) => {
  // a device can be binded to five accounts
  // and you can have five accounts binded to one device

  // find if user exists already
  let inputs = ['deviceName', 'deviceID', 'deviceOS'];
  let userID = req.body.userID;
  let deviceID = req.body.deviceID;
  if (!userID) {
    return res.status(400).json({ status: 200, message: `Please add userID` });
  }

  let err = validator(inputs, req.body);
  if (err.length >= 1)
    return res.status(400).json({ status: 400, message: err });

  let user = await db.User.findOne({ userID });
  if (!user) {
    // create user
    user = await db.User.create({ userID });
  }
  // find the user in the device Collection and make sure
  // their device's is not more than five
  // first make sure the device ID does not exist
  const foundDevice = await db.Device.findOne({ deviceID: req.body.deviceID });
  if (foundDevice)
    return res
      .status(400)
      .json({ status: 400, message: `device already binded, please login` });

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
};

export const login = async (req: Request, res: Response) => {
  let inputs = ['deviceID', 'userID'];
  let err = validator(inputs, req.body);
  if (err.length >= 1)
    return res.status(401).json({ status: 401, message: err });

  // first find user. if no user, they've not binded
  const user = await db.User.findOne({ userID: req.body.userID });
  if (!user)
    return res
      .status(401)
      .json({ status: 401, message: `Please bind this device to continue` });

  const userDevices = await db.Device.findOne({
    user: user._id,
    deviceID: req.body.deviceID
  });

  if (!userDevices)
    return res
      .status(401)
      .json({ status: 401, message: `Please bind this device to continue` });

  const log = await db.Log.create({
    userID: req.body.userID,
    device: userDevices._id,
    status: 'successful'
  });

  return res
    .status(200)
    .json({ status: 200, message: `user device already successfully binded`, log } );
};
