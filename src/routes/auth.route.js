import { Router } from "express";
import * as UserController from "../controller/user.controller.js";

import verifyToken from "../service/jwt/jwt.verifyToken.js";

// Erstelle neue Router Instanz
const authRouter = Router();

authRouter.route('/validate-token')
    .get(verifyToken, UserController.validateUser);

// Routen Definition fuer /register
authRouter.route('/register')
    .post(UserController.registerNewUser)

authRouter.route('/register/email')
    .post(UserController.validateEmail)


// Routen Definition fuer /login
authRouter.route('/login')
    .post(UserController.userLogin)

// Routen Definition fuer /login
authRouter.route('/logout')
    .get(UserController.userLogout)

export default authRouter;