import { Router } from "express";
import { registerNewUser, loginUser} from "../controller/user.controller.js";




// Erstelle neue Router Instanz
const authRouter = Router();

// Routen Definition fuer /register
authRouter.route('/register')
    .post(registerNewUser)

// Routen Definition fuer /login
authRouter.route('/login')
    .post(loginUser)


export default authRouter;