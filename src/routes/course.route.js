import { Router } from "express";
import * as CourseController from "../controller/course.controller.js";


// Erstelle neue Router Instanz
const courseRouter = Router();

courseRouter.route('/:id')
    .get(CourseController.getCourseById);

export default courseRouter;

