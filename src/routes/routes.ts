import { Router } from 'express';
import * as user from '../controllers/user';
import { asyncError } from '../errorhandler/errorhandler';
const router = Router();

router.route('/device/binding').post(asyncError(user.deviceBinding));
router.route('/login/logs').post(asyncError(user.login))

export { router };
