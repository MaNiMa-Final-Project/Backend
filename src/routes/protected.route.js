import { Router } from "express";
import jwt from 'jsonwebtoken';

import verifyToken from "../service/jwt/jwt.verifyToken.js";
import isAdminOrCreator from "../service/authorization/isAdminOrCreator.js";

import * as CourseController from "../controller/course.controller.js";
import * as UserController from "../controller/user.controller.js";




// Erstelle neue Router Instanz
const protectedRouter = Router();

protectedRouter.route('/createcourse')
    .post(verifyToken, isAdminOrCreator, CourseController.createCourse)

protectedRouter.route('/user')
    .get(verifyToken, UserController.getUserById)

protectedRouter.route('/users')
    .get(verifyToken, UserController.getUserByQuery)

protectedRouter.route('/role')
    .get(verifyToken, UserController.changeUserRole)



export default protectedRouter;