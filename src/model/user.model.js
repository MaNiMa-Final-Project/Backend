import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    nickName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    attendedCourses: [{type: mongoose.Types.ObjectId, ref: 'Courses'}],
    upcomingCourses: [{type: mongoose.Types.ObjectId, ref: 'Courses'}],
    notedCourses: [{type: mongoose.Types.ObjectId, ref: 'Courses'}],

    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

//?-----BasicFunctions-----

export async function findUserByUsername(nickName) {
    let user = await User.findOne({nickName: nickName});
    if(!user) throw new Error(`User with ${nickName} not found!`, {cause: 404});
    return user;
}
//DB-Funktion zum Abrufen eines bestimmten User-Eintrags per ID
export async function findUserById(userId) {
    let user = await User.findOne({_id: userId});
    if(!user) throw new Error(`User with ${userId} not found!`, {cause: 404});
    return user;
}

export async function findUserByMail(email) {
    let user = await User.findOne({email: email});
    if(!user) throw new Error(`User with ${email} not found!`, {cause: 404});
    return user;
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

