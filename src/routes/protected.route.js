import { Router } from "express";
import jwt from 'jsonwebtoken';

import verifyToken from "../service/jwt/jwt.verifyToken.js";
import isAdminOrCreator from "../service/authorization/isAdminOrCreator.js";

import * as CourseController from "../controller/course.controller.js";



// Erstelle neue Router Instanz
const protectedRouter = Router();

protectedRouter.route('/createcourse', verifyToken, isAdminOrCreator)
    .post(CourseController.createCourse)




export default protectedRouter;