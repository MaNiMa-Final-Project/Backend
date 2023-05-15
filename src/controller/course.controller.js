import * as CourseModel from "../model/course.model.js";
import * as UserModel from "../model/user.model.js"
import * as imageService from "../service/cloudinary.service.js";



export async function getAllCourses(req, res) {
    try {
        // fuehre Model-Funktion zum Erhalten aller Kurse aus
        let response = await CourseModel.getAll();
        // sende erfolgreiche response zurueck
        res.send(response)
        
    } catch (error) {
        //  Wenn kein Grund für den Fehler angegeben ist, wird eine Fehlermeldung 
        // mit dem HTTP-Statuscode 400 (Bad Request) an den Client zurückgesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function getMultipleCourses(req, res) {
    const ids = req.body.ids; // [ '5f6a4cd331f7869e056a996d', '5f6a4eb9352f7d628b1c60d7' ]

    const query = req.query.q;

      
    try {
        if (ids) {
            const response = await CourseModel.getSeveralCourses(ids);
            res.send(response)
        }
        if (query) {
            const response = await CourseModel.getCoursesByQuery(query);
            res.send(response)
        }
    } catch (error) {
        //  Wenn kein Grund für den Fehler angegeben ist, wird eine Fehlermeldung 
        // mit dem HTTP-Statuscode 400 (Bad Request) an den Client zurückgesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
    
}

export async function getCoursesByCreator(req, res) {
    const creatorId = req.params.id

    try {

        let courses = await CourseModel.getCoursesByCreator(creatorId);
        let creatorData = await UserModel.findUserById(creatorId)

        let response = {
            creatorData: creatorData,
            courses: courses
        }

        res.send(response)
        
    } catch (error) {
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }

}

export async function createCourse(req, res) {
    let newCourse = req.body
    try {

        const imgURl = await imageService.upload(newCourse.image,"courses", newCourse.title);
        newCourse.image = imgURl;
        console.log("🚀 ~ file: course.controller.js:73 ~ newCourse.image:", newCourse.image)


        const response = await CourseModel.insertNewCourse(newCourse);

        res.send("response");
        
    } catch (error) {
        //  Wenn kein Grund für den Fehler angegeben ist, wird eine Fehlermeldung 
        // mit dem HTTP-Statuscode 400 (Bad Request) an den Client zurückgesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}


export async function getCourseById(req, res) {
    // extrahiere Kurs-ID
    let courseId = req.params.id

    try {
        //  fuehre Model-Funktion zum Erhalten eines Kurses anhand der ID aus
        let response = await CourseModel.findRawCourseById(courseId);
        // sende erfolgreiche response zurueck
        res.send(response)
        
    } catch (error) {
        //  Wenn kein Grund für den Fehler angegeben ist, wird eine Fehlermeldung 
        // mit dem HTTP-Statuscode 400 (Bad Request) an den Client zurückgesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}


export async function deleteCourseById(req, res) {
    // extrahiere Kurs-ID
    let id = req.params.id;

    try {
        //  fuehre Model-Funktion zum Loeschen eines Kurses anhand der ID aus
        let response = await CourseModel.deleteCourse(id)

        
        //loesche zugehoeriges Bild aus der Cloud
        imageService.remove(response.image);

        // sende erfolgreiche response zurueck       
        res.send(response);

    } catch (error) {
        //  Wenn kein Grund für den Fehler angegeben ist, wird eine Fehlermeldung 
        // mit dem HTTP-Statuscode 400 (Bad Request) an den Client zurückgesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}


export async function attendToCourse(req, res) {
    // extrahiere user ID aus dem JWT-Token des Clients
    const userId = req.tokenPayload.id;
    // extrahiere Kurs ID
    const courseId = req.params.id;

    try {
        // rufe Methode attendToCourseById des CourseModel auf,
        // um den Benutzer für den Kurs mit der angegebenen ID anzumelden
        await CourseModel.attendToCourseById(courseId, userId)
        res.send({success: true});
    } catch (error) {
        //  Wenn kein Grund für den Fehler angegeben ist, wird eine Fehlermeldung 
        // mit dem HTTP-Statuscode 400 (Bad Request) an den Client zurückgesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }

}