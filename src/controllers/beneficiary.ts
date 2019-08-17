import { Request, Response } from 'express';
import * as rp from 'request-promise-native';
import { randomBytes } from 'crypto';
import { validator } from '../errorhandler/errorhandler';
import * as db from '../models';
let baseUrl = `https://stanbic.nibse.com/mybank/api`;
const editBeneficiaryURl = `${baseUrl}/BeneficiaryManagement/EditBeneficiary`;
const fetchBeneficiaryUrl = `${baseUrl}/BeneficiaryManagement/GetBeneficiaryList`;
const addBeneficiaryUrl = `${baseUrl}/BeneficiaryManagement/AddBeneficiary`;

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
      AccountNo: req.body.AccountNo,
      UserId: req.body.UserId
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

export const addBeneficiary = async (req: Request, res: Response) => {
  try {
    let input = [
      'userId',
      'beneficiaryAlias',
      'beneficiaryName',
      'beneficiaryAccountNumber',
      'beneficiaryBank',
      'beneficiaryBankCode',
      'beneficiaryReference',
      'customerReference',
      'otp',
      'Token'
    ];
    let err = validator(input, req.body);
    if (err.length) return res.status(400).json({ status: 400, err });

    let data = {
      sessionId: randomBytes(5).toString('hex'),
      userId: req.body.userId,
      beneficiaryAlias: req.body.beneficiaryAlias,
      beneficiaryName: req.body.beneficiaryName,
      beneficiaryAccountNumber: req.body.beneficiaryAccountNumber,
      beneficiaryBank: req.body.beneficiaryBank,
      beneficiaryBankCode: req.body.beneficiaryBankCode,
      beneficiaryEmailAddress: req.body.beneficiaryEmailAddress,
      beneficiaryReference: req.body.beneficiaryReference,
      customerReference: req.body.customerReference,
      otp: req.body.otp,
      otpReference: ''
    };

    const options = {
      method: 'POST',
      uri: addBeneficiaryUrl,
      body: data,
      json: true,
      headers: {
        'content-type': 'application/json',
        'X-STC-AGENT-CACHE': req.body.userId,
        Authorization: `Bearer ${req.body.Token}`
      }
    };
    let response = await rp(options);
    if (response.ResponseCode == '00') {
      // search for the newly created beneficiary
      // so you can get their beneficiaryid
      const data = {
        UserId: req.body.userId
      };
      const options = {
        method: 'POST',
        uri: fetchBeneficiaryUrl,
        body: data,
        json: true,
        headers: {
          'content-type': 'application/json',
          'X-STC-AGENT-CACHE': req.body.userId,
          Authorization: `Bearer ${req.body.Token}`
        }
      };
      let response = await rp(options);
      if (response.ResponseCode == '00') {
        let beneficiaries = response.Beneficiaries.filter(
          (benef: { beneficiaryAccountNumber: string }) =>
            benef.beneficiaryAccountNumber == req.body.beneficiaryAccountNumber
        );
        if (beneficiaries.length) {
          let image = req.body.image ? req.body.image : '';
          // check that the beneficiaryid does not exist already
          for (let val of beneficiaries) {
            let found = await db.Beneficiary.findOne({
              userId: req.body.userId,
              beneficiaryId: val.beneficiaryId
            });
            if (!found) {
              let updated = await db.Beneficiary.create({
                userId: req.body.userId,
                beneficiaryId: val.beneficiaryId,
                image
              });
            }
          }
        }
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
