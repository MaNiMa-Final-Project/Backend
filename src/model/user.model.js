import mongoose from "mongoose";
import * as RoleModel from './role.model.js';


const userSchema = mongoose.Schema({

    nickName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    verificationHash: { type: String },
    attendedCourses: [{type: mongoose.Types.ObjectId, ref: 'Courses'}],
    upcomingCourses: [{type: mongoose.Types.ObjectId, ref: 'Courses'}],
    notedCourses: [{type: mongoose.Types.ObjectId, ref: 'Courses'}],

    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

//?-----BasicFunctions-----

// DB-Funktion zum Abrufen eines bestimmten User-Eintrags per nickName
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

//DB-Funktion zum Abrufen eines bestimmten User-Eintrags per e-mail
export async function findUserByMail(email) {
    let user = await User.findOne({email: email});
    if(!user) throw new Error(`User with ${email} not found!`, {cause: 404});
    return user;
}

export async function findUserByMailOrName(emailOrUsername) {
    let user = await User.findOne({
        $or: [
            { email: emailOrUsername },
            { nickName: emailOrUsername }
        ]
    });
    if(!user) throw new Error(`User not found!`, {cause: 404});
    return user;
}

//DB-Funktion zum Abrufen aller User
export async function getAllUsers() {
    return await User.find();
}

//?-----AdvancedFunctions-----

// DB-Funktion zum Erstellen eines neuen User-Eintrags
export async function insertNewUser(userBody) {
    try {

        const role = await RoleModel.findByName(RoleModel.rolesEnum.unverified); // Findet die "unverified"-Rolle

        userBody.role = role._id; // Setzt die Rolle des neuen Benutzers auf die "unverified"-Rolle

        const newUser = new User(userBody); // Erstellt ein neues "User"-Objekt mit den angegebenen Benutzerdaten

        return await newUser.save(); // Speichert den neuen Benutzer in der Datenbank und gibt das neue Benutzer-Objekt zurück

    } catch (error) {
        if ( (error.hasOwnProperty('code')) && (error.code === 11000) ) { // Wenn ein eindeutiger Indexverstoß aufgetreten ist, wirft die Funktion einen Fehler mit dem Statuscode 409 (Conflict)
            throw new Error('Username or Email already used', {cause: 409})
        } else throw new Error('unknown problem - todo', {cause: 400})
    }
}

export async function verifyUser(emailHash) {

    // Datumsobjekt fuer JETZT
    const now = new Date();

    const role = await RoleModel.findByName(RoleModel.rolesEnum.user); // Findet die "user"-Rolle

    let user = await User.findOne({verificationHash: emailHash}); // Findet den Benutzer mit dem angegebenen E-Mail-Hash

    if (now - user.updatedAt > (process.env.EMAIL_HASH_DURATION)) throw new Error('Token expired', {cause: 409}) // Wenn kein User gefunden ODER letztes Update des Eintrags laenger als 12 Stunden her

    if (!user) throw new Error('Token invalid', {cause: 409}) // Wenn der Benutzer nicht gefunden wurde, wirft die Funktion einen Fehler mit dem Statuscode 409 (Conflict)

    user.verificationHash = undefined; // Setzt den Verifizierungs-Hash des Benutzers auf "undefined"
    user.role = role._id; // Setzt die Rolle des Benutzers auf die "user"-Rolle

    return await user.save(); // Speichert den Benutzer in der Datenbank und gibt das aktualisierte Benutzer-Objekt zurück
}

export async function verifyEmail(email) {
    return await User.findOne({email: email});
}


