import { Request, Response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';
import * as tinify from 'tinify'
tinify.key = 'xSybnjt81B9BGySlpTbjzmFkkRmst1XC'

export const createAdvert = async (req: Request, res: Response) => {
  if (!req.files)
    return res.status(400).json({ status: 400, message: 'No image selected' });

  if (!req.files.advertImage)
    return res
      .status(400)
      .json({ status: 400, message: `Please select an image to upload` });

  if (!req.files.advertImage.mimetype.includes('image/'))
    return res
      .status(400)
      .json({ status: 400, message: `only images allowed for upload` });

  const input = ['module', 'text', 'title'];

  let err = validator(input, req.body);
  if (err.length >= 1)
    return res.status(400).json({ status: 400, message: err });

 let compress = await tinify.fromBuffer(req.files.advertImage.data)
  let output = await compress.toBuffer()


  let buf = Buffer.from(output);
  let base64 = buf.toString('base64');

  let modules = ['mybank', 'atease', 'pension', 'mutual', 'insurance'];

  if (!modules.includes(req.body.module))
    return res.status(400).json({
      status: 400,
      message: `module can either be mybank, atease, pension, mutual, or insurance`
    });
  
  if(req.body.module === 'mybank') {
    req.body.index = 0
  } else if(req.body.module === 'mutual') {
    req.body.index = 1
  } else if(req.body.module === 'pension') {
    req.body.index = 2
  } else if(req.body.module === 'atease') {
    req.body.index = 3
  } else if(req.body.module === 'insurance') {
    req.body.index = 4
  }

  req.body.advertImage = base64;
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
