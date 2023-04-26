import { Router } from "express";
import * as CourseController from "../controller/course.controller.js";


// Erstelle neue Router Instanz
const courseRouter = Router();

courseRouter.route('/')
    .post(CourseController.getMultipleCourses)

courseRouter.route('/')
    .get(CourseController.getMultipleCourses)

courseRouter.route('/:id')
    .get(CourseController.getCourseById);


    
export default courseRouter;

