import checkAuth from '../auth.js'


import {  Router } from 'express';

import { getUserControler, loginControler, logoutControler, signupController, verifyEmail ,loginWithGoogle, getAllUsersControler} from '../controlers/user.js';
import { sendOtpController } from '../controlers/sendOtp.js';
import { chectRole, delteUser, logoutUser } from '../controlers/RBA.js';


const router = Router()



router.post('/signup',signupController);
router.post('/login', loginControler);

router.post('/google', loginWithGoogle)
router.post('/send-otp',sendOtpController)
router.post('/verify-otp',verifyEmail)


router.get('/getUser', checkAuth, getUserControler)
router.get('/Users', checkAuth,chectRole, getAllUsersControler)
router.post('/logout', logoutControler)

//admin work route

router.post('/logout-user/:userId',checkAuth,chectRole,logoutUser)
router.post('/delete-user/:userId',checkAuth,chectRole,delteUser)


export default router;


//8800920118 mukesh