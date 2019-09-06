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
