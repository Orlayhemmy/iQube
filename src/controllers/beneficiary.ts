import { Request, Response } from 'express';
import * as rp from 'request-promise-native';
import { randomBytes } from 'crypto';
import { validator } from '../errorhandler/errorhandler';
import * as db from '../models';
const editBeneficiaryURl = `https://stanbic.nibse.com/mybank/api/BeneficiaryManagement/EditBeneficiary`;
const fetchBeneficiaryUrl = `https://stanbic.nibse.com/mybank/api/BeneficiaryManagement/GetBeneficiaryList`;

export const editBeneficiary = async (req: Request, res: Response) => {
  try {
    let input = [
      'OTP',
      'UserId',
      'beneficiaryReference',
      'BeneficiaryId',
      'customerReference',
      'Token'
    ];

    let err = validator(input, req.body);
    if (err.length) return res.status(400).json({ status: 400, err });

    const data = {
      sessionId: randomBytes(5).toString('hex'),
      UserId: req.body.UserId,
      beneficiaryReference: req.body.beneficiaryReference,
      OTP: req.body.OTP,
      BeneficiaryId: req.body.BeneficiaryId,
      SourceReferenceId: '',
      customerReference: req.body.customerReference
    };
    const options = {
      method: 'POST',
      uri: editBeneficiaryURl,
      body: data,
      json: true,
      headers: {
        'content-type': 'application/json',
        'X-STC-AGENT-CACHE': req.body.UserId,
        Authorization: `Bearer ${req.body.Token}`
      }
    };
    let response = await rp(options);

    if (response.ResponseCode == '00') {
      let user = await db.Beneficiary.findOne({
        beneficiaryId: req.body.BeneficiaryId,
        userId: req.body.UserId
      });

      let image = req.body.image ? req.body.image : '';

      if (!user) {
        let created = await db.Beneficiary.create({
          beneficiaryId: req.body.BeneficiaryId,
          userId: req.body.UserId,
          image
        });
      } else {
        let updated = await db.Beneficiary.findOneAndUpdate(
          { _id: user._id },
          { $set: { image } }
        );
      }
      return res.status(200).json({
        status: 200,
        ResponseCode: response.ResponseCode,
        ResponseFriendlyMessage: response.ResponseFriendlyMessage
      });
    }
    return res.status(400).json({
      status: response.ResponseCode,
      message: response.ResponseDescription
    });
  } catch (e) {
    return res
      .status(e.statusCode)
      .json({ status: e.statusCode, message: e.message });
  }
};

export const fetchBeneficiary = async (req: Request, res: Response) => {
  try {
    let input = ['AccountNo', 'UserId', 'Token'];

    let err = validator(input, req.body);
    if (err.length) return res.status(400).json({ status: 400, err });
    const data = {
      AccountNo: '0023120061',
      UserId: '0006756856'
    };
    const options = {
      method: 'POST',
      uri: fetchBeneficiaryUrl,
      body: data,
      json: true,
      headers: {
        'content-type': 'application/json',
        'X-STC-AGENT-CACHE': req.body.UserId,
        Authorization: `Bearer ${req.body.Token}`
      }
    };
    let response = await rp(options);
    if (response.ResponseCode == '00') {
      // fetch users with beneficiary id
      let Beneficiaries: Array<object> = [];
      for (let val of response.Beneficiaries) {
        val.image = '';
        let usersBeneficiaries = await db.Beneficiary.findOne({
          userId: req.body.UserId,
          beneficiaryId: val.beneficiaryId
        });

        if (usersBeneficiaries) val.image = usersBeneficiaries.image;

        Beneficiaries.push(val);
      }

      return res.status(200).json({
        Beneficiaries,
        status: 200,
        ResponseCode: response.ResponseCode,
        ResponseFriendlyMessage: response.ResponseFriendlyMessage
      });
    }
    return res.status(400).json({
      status: response.ResponseCode,
      message: response.ResponseDescription
    });
  } catch (e) {
    return res
      .status(e.statusCode)
      .json({ status: e.statusCode, message: e.message });
  }
};
