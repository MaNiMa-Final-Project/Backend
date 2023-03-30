import * as CourseModel from "../model/course.model.js";



export async function registerNewCourse(req, res) {
    let body = req.body;

    try {
        
        let response = await CourseModel.insertNewCourse(body);

       
        res.send(response)
        
    } catch (error) {
        
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}


export async function getAllCourses(req, res) {
    try {
        let response = await CourseModel.getAll();
        
        res.send(response)
        
    } catch (error) {
       
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}


export async function getCourseById(req, res) {
    let courseId = req.params.id
    try {
        let response = await CourseModel.findCourseId(courseId);
       
        res.send(response)
        
    } catch (error) {
       
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}