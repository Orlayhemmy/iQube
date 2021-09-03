import { Router } from 'express';
import * as user from '../controllers/user';
import { asyncError } from '../errorhandler/errorhandler';
import * as transaction from '../controllers/transactionHistory';
import * as beneficiaryController from '../controllers/beneficiary';
import * as advertController from '../controllers/advert';
import * as atEaseUser from '../controllers/@easesUser';
import * as Push from '../controllers/push';
import { deviceBindingValidation, loginValidation, unlinkDeviceValidation } from '../validation/validations';
const router = Router();

router.route('/device/binding/old').post(asyncError(user.deviceBinding));
router.route('/device/binding').post(deviceBindingValidation, asyncError(user.deviceBindingAction));
router.route('/login/logs').post(asyncError(user.login));
router.route('/login').post(loginValidation, asyncError(user.loginAction));
router.route('/transaction/history').post(asyncError(transaction.sortHistory));
router.route('/device/all').post(asyncError(user.viewAllBindedDevices));
router.route('/device/unlink/old').post(asyncError(user.unlinkDevice));
router.route('/device/unlink').post(unlinkDeviceValidation, asyncError(user.unlinkDeviceAction));
router.route('/device/sendotp').post(asyncError(user.sendOTPforUnLinkDevice));

router.route('/atease/device/login').post(asyncError(atEaseUser.login));
router.route('/atease/device/link').post(asyncError(atEaseUser.bindDevice));
router.route('/atease/device/unlink').post(asyncError(atEaseUser.unlinkDevice));
router.route('/atease/device/all').post(asyncError(atEaseUser.viewAllBindedDevices));

router.route('/atease/addprofile').post(asyncError(atEaseUser.addOrUpdateProfileImage));

router.route('/atease/viewprofile').post(asyncError(atEaseUser.fetchImage));

router.route('/mybank/edit/beneficiary').post(asyncError(beneficiaryController.editBeneficiary));
router.route('/mybank/fetch/beneficiary').post(asyncError(beneficiaryController.fetchBeneficiary));
router.route('/mybank/add/beneficiary').post(asyncError(beneficiaryController.addBeneficiary));

router.route('/mybank/addprofile').post(asyncError(user.addOrUpdateProfileImage));

router.route('/mybank/viewprofile').post(asyncError(user.fetchImage));

router.route('/admin/advert').get(asyncError(advertController.fetchAllActiveAdverts));

router.route('/admin/advert/:id').get(asyncError(advertController.fetchAdvert));

router.route('/push/fetch').post(asyncError(Push.fetchMessages));

router.route('/update/status').post(asyncError(Push.updateStatus));
export { router };
