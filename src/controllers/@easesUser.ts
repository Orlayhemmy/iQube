import { Request, Response } from 'express';
import * as db from '../models';
import { validator } from '../errorhandler/errorhandler';
import * as rp from 'request-promise-native';
const baseUrl = `https://stanbic.nibse.com/mybank/api`;
let initiateOTPURL = `${baseUrl}/UserProfileManagement/InitiateVBOTP`;

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
  let inputs = [
    'deviceName',
    'deviceID',
    'deviceOS',
    'Otp',
    'Reference',
    'userID'
  ];
};

export const login = async (req: Request, res: Response) => {
  try {
    let inputs = ['UserId', 'deviceID'];
    let err = validator(inputs, req.body);
    if (err.length >= 1)
      return res.status(401).json({ status: 401, message: err });

    const user = await db.AtEaseUser.findOne({ userID: req.body.UserId });

    if (!user) {
      let response = await initiateOTP(req);
      if (response.ResponseCode != '00') {
        response = await initiateOTP(req);
      }
      return res.status(200).json({
        status: 202,
        message: `An otp has been sent to you for device binding`
      });
    }
    const userDevice = await db.AtEaseUser.findOne({
      userID: req.body.UserId,
      deviceID: req.body.deviceID
    });

    if (!userDevice) {
      let response = await initiateOTP(req);
      if (response.ResponseCode != '00') {
        response = await initiateOTP(req);
      }
      return res.status(200).json({
        status: 202,
        message: `An otp has been sent to you for device binding`
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
