import { Router } from 'express';
import * as user from '../controllers/user';
import { asyncError } from '../errorhandler/errorhandler';
import * as transaction from '../controllers/transactionHistory';
import * as beneficiaryController from '../controllers/beneficiary';
import * as adminController from '../controllers/admin';
const router = Router();

router.route('/device/binding').post(asyncError(user.deviceBinding));
router.route('/login/logs').post(asyncError(user.login));
router.route('/transaction/history').post(asyncError(transaction.sortHistory));
router.route('/device/all').post(asyncError(user.viewAllBindedDevices));
router.route('/device/unlink').post(asyncError(user.unlinkDevice));
router.route('/device/sendotp').post(asyncError(user.sendOTPforUnLinkDevice));

router
  .route('/mybank/edit/beneficiary')
  .post(asyncError(beneficiaryController.editBeneficiary));
router
  .route('/mybank/fetch/beneficiary')
  .post(asyncError(beneficiaryController.fetchBeneficiary));
router
  .route('/mybank/add/beneficiary')
  .post(asyncError(beneficiaryController.addBeneficiary));

router
  .route('/mybank/addprofile')
  .post(asyncError(user.addOrUpdateProfileImage));

router.route('/mybank/viewprofile').post(asyncError(user.fetchImage));

router.route('/admin/users').get(asyncError(adminController.fetchAllUsers));

router
.route('/admin/user/search')
.get(asyncError(adminController.searchByUserID));

router.route('/admin/user/:id').get(asyncError(adminController.fetchAUser));
export { router };
