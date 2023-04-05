import mongoose from "mongoose";

const courseSchema = mongoose.Schema({

    title: {type: String, required: true, unique: true},
    creator: {type: mongoose.Types.ObjectId, ref: 'User'},
    beginning: { type: Date, required: true},
    duration: { type: Number, required: true},
    start: { type: String, required: true},
    end: { type: String, required: true},
    description: {type: String, required: true},
    comments: [{type: mongoose.Types.ObjectId, ref: 'Comment'}],
    participants: [{type: mongoose.Types.ObjectId, ref: 'User'}]

},{ timestamps: true });
    

const Course = mongoose.model('Course', courseSchema);

//?-----BasicFunctions-----

export async function findRawCourseByTitle(title) {
    let course = await Course.findOne({title: title});
    if(!course) throw new Error(`Course with ${title} not found!`, {cause: 404})
    return course;
}

export async function findRawCourseById(courseId) {
    let course = await Course.findOne({_id: courseId});
    if(!course) throw new Error(`Course with ${courseId} not found!`, {cause: 404})
    return course;
}


//?-----AdvancedFunctions-----


// DB-Funktion zum Erstellen eines neuen Kurs-Eintrags
export async function insertNewCourse(courseBody) {
    try {
        // Erstelle neue Instanz des Event Models
        const newCourse = new Course(courseBody);

        // Speichere neue Instanz
        return await newCourse.save();

    } catch (error) {
        // Pruefe, ob Konflikt durch Dupletten-Verletzung
        if ( (error.hasOwnProperty('code')) && (error.code === 11000) ) {
            // entsprechendes Fehlerobjekt wird gesendet
            throw {
                code: 409,
                message: error.message
            };

        } else {
            // Muss ein Validierungsproblem sein
            // entsprechendes Fehlerobjekt wird gesendet
            throw {
                code: 400,
                message: error.message
            };
        }
    }
}


// DB-Funktion zum Abrufen aller Kurs-Eintraege
export async function getAll() {
    return await Course.find().populate('participants');
}

// DB-Funktion zum Aendern eines Kurs-Eintrags anhand der ID
export async function modifyCourse(courseId, body) {
    return await Course.findByIdAndUpdate(courseId, body)
}

// DB-Funktion zum Loeschen eines Kurses anhand der ID
export async function deleteCourse(courseId) {
    return await Course.deleteOne({_id:courseId})
}


export async function attendToCourseById(courseId, userId){

// hole den Kurs anhand der Kurs ID
    let course = await getCourseById(courseId);
// wenn Kurs mit entsprechender ID nicht da ist sende Fehlermeldung    
    if(!course) throw new Error(`Course with ID: ${courseId} not found!`, {cause: 404})

// fuege den User anhand der ID als Teilnehmer des Kurses hinzu    
    course.participants.push(userId);
// Füge den Kurs dem Benutzer  anhand der userId hinzu
    await addCourseToUser(courseId, userId)
// speichere den aktualisierten Kurs 
    await course.save();

    return await getCourseById(courseId);
}


