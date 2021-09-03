import { Request, Response, Next } from 'express'
import { validator } from '../errorhandler/errorhandler'

export const loginValidation = (req: Request, res: Response, next: Next) => {
    let inputs = ['deviceID', 'userID', 'CifId', 'Token', 'type']
    let err = validator(inputs, req.body)
    if (err.length >= 1)
        return res.status(401).json({ status: 401, message: err })
    next()
}

export const deviceBindingValidation = (req: Request, res: Response, next: Next) => {
    let inputs = [
        'deviceName',
        'deviceID',
        'deviceOS',
        'Otp',
        'Reference',
        'userID',
        'Token',
        'type'
    ];
    let err = validator(inputs, req.body)
    if (err.length >= 1)
        return res.status(400).json({ status: 400, message: err })
    next()
}

export const unlinkDeviceValidation = (req: Request, res: Response, next: Next) => {
    let inputs = ['deviceID', 'Otp', 'Reference', 'userID', 'Token', 'type'];
    let err = validator(inputs, req.body);
    if (err.length >= 1)
        return res.status(400).json({ status: 400, message: err });
    next()
}
