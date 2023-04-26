import { Router } from "express";
import * as CourseController from "../controller/course.controller.js";

import verifyToken from "../service/jwt/jwt.verifyToken.js";


// Erstelle neue Router Instanz
const courseRouter = Router();


courseRouter.route('/')
    .post(CourseController.getMultipleCourses) //ShoppingCart

courseRouter.route('/')
    .get(verifyToken, CourseController.getMultipleCourses) //AdminDashboard

courseRouter.route('/:id')
    .get(CourseController.getCourseById);



export default courseRouter;

