import { Request, Response } from 'express';
import * as db from '../models';


export const fetchAdvert = async (req: Request, res: Response) => {
  const advert = await db.Advert.findOne({ _id: req.params.id });
  return res.status(200).json({ status: 200, data: advert });
};

export const fetchAllAdverts = async (req: Request, res: Response) => {
  const adverts = await db.Advert.find({}).sort({ index: 1 });
  return res.status(200).json({ status: 200, data: adverts });
};
