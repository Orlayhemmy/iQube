import { Response, Request, NextFunction } from 'express';

export const asyncError = (fn: any) => {
  return function(req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch(next);
  };
};

interface Err {
  message: string;
  status: number;
}

// If routes not found
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  let err: Err = {
    status: 404,
    message: 'Route not found'
  };
  next(err);
};

export const prodError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 500).json(err.message);
};

export const validator = (arr: string[], body: any): string[] => {
  let errMe = [];
  for (let input of arr) {
    if (!body[input]) errMe.push(`${input} is required`);
  }
  return errMe;
};
