import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    nickName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    attendedCourses: [{type: mongoose.Types.ObjectId, ref: 'Courses'}],
    upcomingCourses: [{type: mongoose.Types.ObjectId, ref: 'Courses'}],
    notedCourses: [{type: mongoose.Types.ObjectId, ref: 'Courses'}],

    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

//?-----BasicFunctions-----

export async function findUserByUsername(nickName) {
    return await User.findOne({nickName: nickName});
}
//DB-Funktion zum Abrufen eines bestimmten User-Eintrags per ID
export async function findUserById(userId) {
    return await User.findOne({_id: userId});
}

export async function findUserByMail(email) {
    return await User.findOne({email: email});
}

export async function getAllUsers() {
    return await User.find();
}

//?-----AdvancedFunctions-----

// DB-Funktion zum Erstellen eines neuen User-Eintrags
export async function insertNewUser(userBody) {
    try {
        // Erstelle neue Instanz des User Models
        const newUser = new User(userBody);

        // Speichere neue Instanz
        return await newUser.save();

    } catch (error) {
        // Pruefe, ob Conflict durch Dupletten-Verletzung
        if ( (error.hasOwnProperty('code')) && (error.code === 11000) ) {
            // Schmeisse entsprechendes Fehlerobjekt
            throw {
                code: 409,
                message: error.message
            };
        } else {
            // Muss ein Validierungsproblem sein
            // sende entsprechendes Fehlerobjekt
            throw {
                code: 400,
                message: error.message
            };
        }
    }
}

