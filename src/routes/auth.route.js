import { Router } from "express";
import { registerNewUser, userLogin, userLogout } from "../controller/user.controller.js";
import verifyToken from "../service/jwt/jwt.verifyToken.js";

// Erstelle neue Router Instanz
const authRouter = Router();

authRouter.route('/status')
    .get(verifyToken, (req, res) => {
        res.send({ success: true, message: 'Valid token' });
    });

// Routen Definition fuer /register
authRouter.route('/register')
    .post(registerNewUser)

// Routen Definition fuer /login
authRouter.route('/login')
    .post(userLogin)

// Routen Definition fuer /login
authRouter.route('/logout')
    .post(userLogout)

export default authRouter;