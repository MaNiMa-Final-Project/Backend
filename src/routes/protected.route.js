import { Router } from "express";
import jwt from 'jsonwebtoken';

import verifyToken from "../service/jwt/jwt.verifyToken.js";
import isAdminOrCreator from "../service/authorization/isAdminOrCreator.js";

import * as CourseController from "../controller/course.controller.js";
import * as UserController from "../controller/user.controller.js";

import { validationResult } from 'express-validator';
import { validationMiddleware } from '../service/validation/courseSchema.js';

function myRouteHandler(req, res, next) {  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}



// Erstelle neue Router Instanz
const protectedRouter = Router();

protectedRouter.route('/createcourse')
    .post([verifyToken, isAdminOrCreator, validationMiddleware, myRouteHandler], CourseController.createCourse)

protectedRouter.route('/user')
    .get(verifyToken, UserController.getUserById)

protectedRouter.route('/users')
    .get(verifyToken, UserController.getUserByQuery)

protectedRouter.route('/role')
    .get(verifyToken, UserController.changeUserRole)

protectedRouter.route('/edituser')
    .put(verifyToken, UserController.editUser)

protectedRouter.route('/efoijgvaeipr')
    .put(verifyToken, UserController.pwChange)



export default protectedRouter;