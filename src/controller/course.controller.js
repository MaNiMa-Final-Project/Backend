import * as CourseModel from "../model/course.model.js";



export async function registerNewCourse(req, res) {
// extrahiere den body des req-objektes   
    let body = req.body;

    try {
        // Fuehre Model-Funktion zum Einfuegen eines neuen Kurses aus
        let response = await CourseModel.insertNewCourse(body);

        // sende erfolgreiche response zurueck
        res.send(response)
        
    } catch (error) {
        //  Wenn kein Grund für den Fehler angegeben ist, wird eine Fehlermeldung 
        // mit dem HTTP-Statuscode 400 (Bad Request) an den Client zurückgesendet
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}


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


export async function getCourseById(req, res) {
    // extrahiere Kurs-ID
    let courseId = req.params.id
    try {
        //  fuehre Model-Funktion zum Erhalten eines Kurses anhand der ID aus
        let response = await CourseModel.findCourseId(courseId);
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