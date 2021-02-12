import { Router } from 'express';
const router : Router = Router();

//CONTROLLADOR USER
import { userController } from '../controllers/user.controller'

router.get('/user/singin' , userController.signinForm);
router.post('/user/singin/add' , userController.signinFormAdd)

router.get('/user/signup' , userController.signupForm);
router.post('/user/signup/add' , userController.signupFormAdd);

router.get('/user/logout', userController.logout);

export default router;