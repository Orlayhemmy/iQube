import { Request, Response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';
import * as tinify from 'tinify';
import * as path from 'path';
import * as fs from 'fs';
import * as cryto from 'crypto';
tinify.key = 'xSybnjt81B9BGySlpTbjzmFkkRmst1XC';
import { UploadedFile } from 'express-fileupload';


export const fetchAdvert = async (req: Request, res: Response) => {
  const advert = await db.Advert.findOne({ _id: req.params.id });
  return res.status(200).json({ status: 200, data: advert });
};

export const fetchAllAdverts = async (req: Request, res: Response) => {
  const adverts = await db.Advert.find({}).sort({ index: 1 });
  return res.status(200).json({ status: 200, data: adverts });
};
