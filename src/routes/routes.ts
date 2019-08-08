import { Router } from 'express';
import * as user from '../controllers/user';
import { asyncError } from '../errorhandler/errorhandler';
import * as transaction from '../controllers/transactionHistory';
const router = Router();

router.route('/device/binding').post(asyncError(user.deviceBinding));
router.route('/login/logs').post(asyncError(user.login));
router.route('/transaction/history').post(asyncError(transaction.sortHistory));

export { router };
