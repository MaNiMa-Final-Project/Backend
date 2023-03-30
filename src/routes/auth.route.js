import { Router } from "express";
import { registerNewUser, loginUser} from "../controller/user.controller.js";
import verifyToken from "../service/jwt/jwt.verifyToken.js";

// Erstelle neue Router Instanz
const authRouter = Router();

authRouter.route('/status')
    .get(verifyToken, () => {success: true});

// Routen Definition fuer /register
authRouter.route('/register')
    .post(registerNewUser)

// Routen Definition fuer /login
authRouter.route('/login')
    .post(loginUser)


export default authRouter;