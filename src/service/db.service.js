import mongoose from "mongoose";

/* 
    Alternativ kann die Verbindung auch einmalig ueber mongoose.connect aufgebaut werden,
    so dass sie als 'default' Connection in mongoose gehalten wird.
    So kann sich immer nur mit einer Datenbank gleichzeitig verbunden werden, erspart uns jedoch evtl.
    etwas Komplexitaet, weil wir uns dann fast gar nicht um die Verbindung kuemmern muessen ausser sie einmal aufzubauen.
*/
/* 
    Diese Funktion wuerde man einmalig in der index.js aufrufen und ab dann,
    immer ueber mongoose die Models anmelden etc.
*/
export async function connectToDb(callback) {
    try {
        // Setze den 'strict' Mode fuer mongoose (Felder, die nicht im Schema enthalten sind, werden nicht mitgespeichert)
        mongoose.set('strictQuery', true);

        await mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, {
            maxPoolSize: 10
        });

        // Falls callback direkt nach Verbindung ausgefuehrt werden soll
        // Bspw. ein Seeding von intialen DB Eintraegen
        if (callback) {
            // fuehre callback aus
            callback();
        }

        console.log('Connection to DB established');

    } catch (error) {
        console.error(error);
    }
}