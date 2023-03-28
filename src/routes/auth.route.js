import { Router } from "express";



// Erstelle neue Router Instanz
const authRouter = Router();

// Routen Definition fuer /register
authRouter.route('/register')
    .post()

// Routen Definition fuer /login
authRouter.route('/login')
    .post()


export default authRouter;