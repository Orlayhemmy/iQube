import { Request, Response, NextFunction } from 'express';

export const guard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization)
    return res.status(401).json('No Authorization Token provided');
  let verification = req.headers.authorization.split(' ')[1];
  if (
    verification ===
    'a1f94dfe0b38c6fe98b68f754389c781f7836b0074cf61eee749ae1c989a218a'
  ) {
    next();
  } else {
    return res.status(401).json('Incorrect Authrozation Token');
  }
};
