import { Request, Response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';
import request = require('request');

export const createAdvert = async (req: Request, res: Response) => {
  const input = ['module', 'text', 'title', 'advertImage'];
  let err = validator(input, req.body);
  if (err.length >= 1)
    return res.status(401).json({ status: 401, message: err });
  let modules = ['mybank', 'atease', 'pension', 'mutual', 'insurance'];

  if (!modules.includes(req.body.module))
    return res.status(400).json({
      status: 400,
      message: `module can either be mybank, atease, pension, mutual, or insurance`
    });

  let advert = await db.Advert.findOne({ module: req.body.module });
  if (!advert) {
    // create advert
    let createdAdvert = await db.Advert.create(req.body);
    return res.status(200).json({
      status: 200,
      message: `Advert succesfully created`,
      advert: createdAdvert
    });
  }
  // update advert if module exists
  let updatedAdvert = await db.Advert.findOneAndUpdate(
    { _id: advert._id },
    { $set: req.body },
    { new: true }
  );
  return res.status(200).json({
    status: 200,
    message: `Advert successfully created`,
    advert: updatedAdvert
  });
};

export const fetchAdvert = async (req: Request, res: Response) => {
  const advert = await db.Advert.findOne({ _id: req.params.id });
  return res.status(200).json({ status: 200, data: advert });
};

export const fetchAllAdverts = async (req: Request, res: Response) => {
  const adverts = await db.Advert.find({});
  return res.status(200).json({ status: 200, data: adverts });
};
