import { Request, Response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';
import * as tinify from 'tinify';
import * as path from 'path';
import * as fs from 'fs';
import * as cryto from 'crypto';
tinify.key = 'xSybnjt81B9BGySlpTbjzmFkkRmst1XC';

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

  let compress = await tinify.fromBuffer(req.files.advertImage.data);
  let output = await compress.toBuffer();

  req.files.advertImage.data = Buffer.from(output);

  let modules = ['mybank', 'atease', 'pension', 'mutual', 'insurance'];

  if (!modules.includes(req.body.module))
    return res.status(400).json({
      status: 400,
      message: `module can either be mybank, atease, pension, mutual, or insurance`
    });

  let advertImage = req.files.advertImage;
  let filepath = path.join(__dirname, '..', 'public/upload');

  let extension = advertImage.mimetype.split('/')[1];

  let filename = `${cryto.randomBytes(5).toString('hex')}.${extension}`;

  if (!fs.existsSync(filepath)) fs.mkdirSync(filepath, { recursive: true });

  let imagePath = `${filepath}/${filename}`;

  await advertImage.mv(imagePath);

  if (req.body.module === 'mybank') {
    req.body.index = 0;
  } else if (req.body.module === 'mutual') {
    req.body.index = 1;
  } else if (req.body.module === 'pension') {
    req.body.index = 2;
  } else if (req.body.module === 'atease') {
    req.body.index = 3;
  } else if (req.body.module === 'insurance') {
    req.body.index = 4;
  }

  let host = req.get('host');
  let htt = req.secure ? `https` : 'http';
  req.body.advertImage = `${htt}://${host}/upload/${filename}`;
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
  const adverts = await db.Advert.find({}).sort({ index: 1 });
  return res.status(200).json({ status: 200, data: adverts });
};
