import { Request, Response } from 'express';
import * as db from '../models';

export const fetchMessages = async (req: Request, res: Response) => {
  if (!req.body.userID)
    return res.status(400).json({
      status: 400,
      message: 'Please provide a userID',
    });

  let modules = ['mybank', 'atease', 'insurance', 'pension', 'mutual'];
  if (!req.body.module || !modules.includes(req.body.module))
    return res.status(400).json({
      status: 400,
      message: `Please provide a valid module to push to`,
    });

  let messages = await db.Message.find({ userID: req.body.userID, module: req.body.module })
    .sort({ timestamp: -1 })
    .limit(15);

  let userHasReadIt: boolean = true;
  let findings = messages.find((message) => message.userHasReadIt === false);
  if (findings) userHasReadIt = findings.userHasReadIt;

  return res.status(200).json({ status: 200, data: { messages, userHasReadIt } });
};

export const updateStatus = async (req: Request, res: Response) => {
  if (!req.body.userID)
    return res.status(400).json({
      status: 400,
      message: 'Please provide a userID',
    });

  let modules = ['mybank', 'atease', 'insurance', 'pension', 'mutual'];
  if (!req.body.module || !modules.includes(req.body.module))
    return res.status(400).json({
      status: 400,
      message: `Please provide a valid module to push to`,
    });
  let updated = await db.Message.updateMany(
    { userID: req.body.userID, module: req.body.module },
    { $set: { userHasReadIt: true } }
  );

  return res.status(200).json({ status: 200, message: `Status successfully updated` });
};
