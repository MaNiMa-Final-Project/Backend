import * as CommentsModel from "../model/comments.model.js";


export async function insertNewComment(req, res) {
    // extrahiere den body des req-objektes   
        let body = req.body;
    
        try {
            // Fuehre Model-Funktion zum Einfuegen eines neuen Kommentares aus
            let response = await CommentsModel.insertNewComment(body);
    
            // sende erfolgreiche response zurueck
            res.send(response)
            
        } catch (error) {
            //  Wenn kein Grund für den Fehler angegeben ist, wird eine Fehlermeldung 
            // mit dem HTTP-Statuscode 400 (Bad Request) an den Client zurückgesendet
            if(!error.cause) res.status(400).send(error.message)
            else res.status(error.cause).send(error.message)
        }
    }


    export async function deleteComment(req, res) {
        // extrahiere Kommentar ID
        let id = req.params.id;
    
        try {
            //  fuehre Model-Funktion zum Loeschen eines Kommentares anhand der ID aus
            let response = await CommentsModel.deleteComment(id)
            // sende erfolgreiche response zurueck
            res.send(response);
    
        } catch (error) {
            //  Wenn kein Grund für den Fehler angegeben ist, wird eine Fehlermeldung 
            // mit dem HTTP-Statuscode 400 (Bad Request) an den Client zurückgesendet
            if(!error.cause) res.status(400).send(error.message)
            else res.status(error.cause).send(error.message)
        }
    }