import { Request, Response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';

export const fetchAllUsers = async (req: Request, res: Response) => {
  const users = await db.User.find({}).populate(
    'device',
    'deviceID deviceName deviceOS'
  );

  return res.status(200).json({ status: 200, data: { users } });
};

export const fetchAUser = async (req: Request, res: Response) => {
  const user = await db.User.findOne({ userID: req.params.id }).populate(
    'device',
    'deviceID deviceName deviceOS'
  );
  return res.status(200).json({ status: 200, data: { user } });
};

export const searchByUserID = async (req: Request, res: Response) => {
  let q = req.query.q;
  console.log(req.query);
  const user = await db.User.find({
    userID: { $regex: new RegExp(q), $options: 'i' }
  });

  return res.status(200).json({ status: 200, data: { user } });
};

export const unlinkUserDevice = async (req: Request, res: Response) => {
  let inputs = ['deviceID', 'userID'];
  let err = validator(inputs, req.body);
  if (err.length >= 1)
    return res.status(400).json({ status: 400, message: err });

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
    message: `Could not unlink Device because it has not been linked before`
  });
};
