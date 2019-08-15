import { Request, Response } from 'express';
import * as rp from 'request-promise-native';
import { validator } from '../errorhandler/errorhandler';

let yesterday = (): string =>
  new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();

function pastWeek(): string[] {
  let getDays = (num: number) =>
    new Date(new Date().setDate(new Date().getDate() - num)).toDateString();
  let last7Days = [];
  for (let i = 0; i <= 7; i++) {
    last7Days.push(getDays(i));
  }
  return last7Days;
}

export const sortHistory = async (req: Request, res: Response) => {
  try {
    let inputs = ['AccountNumber', 'UserId', 'Token'];
    let errors = validator(inputs, req.body);
    if (errors.length >= 1)
      return res.status(400).json({ status: 400, message: { errors } });

    const data = {
      AccountNumber: req.body.AccountNumber,
      UserId: req.body.UserId,
      TransactionCount: 50
    };
    const options = {
      method: 'POST',
      uri: `https://stanbic.nibse.com/mybank/api/TransactionManagement/GetTransactionDetailsByAccountNumberAndCount`,
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
      let yesterdaysTransaction = response.Transactions.filter(
        (item: { date: string | number | Date }) => {
          if (yesterday() == new Date(item.date).toDateString()) {
            return item;
          }
        }
      );
      let todaysTransaction = response.Transactions.filter(
        (item: { date: string | number | Date }) => {
          if (new Date().toDateString() == new Date(item.date).toDateString()) {
            return item;
          }
        }
      );
      let thisWeek = pastWeek();
      let pastWeekTransactions = response.Transactions.filter(
        (item: { date: string | number | Date }) => {
          if (thisWeek.includes(new Date(item.date).toDateString())) {
            return item;
          }
        }
      );

      return res.status(200).json({
        status: 200,
        data: {
          yesterdaysTransaction,
          todaysTransaction,
          pastWeekTransactions
        }
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
