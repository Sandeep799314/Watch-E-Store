import express from "express";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { registerController, loginController, testController, forgotPasswordController, updateProfileController } from '../controllers/authController.js';


//router object
const router = express.Router();

//routing
//register|| method post
router.post('/register', registerController);

//forget passsword
router.post('/forgot-password', forgotPasswordController)


//login ||post
router.post('/login', loginController);

//test route
router.get('/test', requireSignIn, isAdmin, testController);



//protected route user auth
router.get('/user-auth', requireSignIn, (req, res) => {
        res.status(200).send({ ok: true });
    })
    //protected route for admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
        res.status(200).send({ ok: true });
    })
    //update profile
router.put("/profile", requireSignIn, updateProfileController);

export default router;