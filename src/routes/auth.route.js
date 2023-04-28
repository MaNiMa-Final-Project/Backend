import { Router } from "express";
import * as UserController from "../controller/user.controller.js";
import * as CourseController from "../controller/course.controller.js";


import verifyToken from "../service/jwt/jwt.verifyToken.js";

// Erstelle neue Router Instanz
const authRouter = Router();

authRouter.route('/validate-token')
    .get(verifyToken, UserController.validateUser);

// Routen Definition fuer /register
authRouter.route('/register')
    .post(UserController.registerNewUser)

authRouter.route('/register/email')
    .post(UserController.validateUserEmail)

// Routen Definition fuer /login
authRouter.route('/login')
    .post(UserController.userLogin)

// Routen Definition fuer /login
authRouter.route('/logout')
    .get(UserController.userLogout)

    // Routen Definition fuer /register
authRouter.route('/all')
    .get(CourseController.getAllCourses)

authRouter.route('/dozenten')
    .get(UserController.getAllCreators)

    

export default authRouter;