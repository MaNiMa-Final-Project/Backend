import mongoose from "mongoose";

// Definiere Todo Schema
// ---------------weitere Userinfo erstellen-----------!!

const userSchema = mongoose.Schema({

    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: true, },
    lastname: { type: String, required: true, }
    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);


// DB-Funktion zum Abrufen eines bestimmten User-Eintrags per username
export async function findUserByUsername(username) {
    return await User.findOne({username: username});
}

export async function findUserById(userId) {
    return await User.findOne({_id:userId});
}

// Findet einen Benutzer anhand der E-Mail-Adresse
export async function findUserByMail(email) {
    return await User.findOne({email: email});
}

// DB-Funktion zum Erstellen eines neuen User-Eintrags
export async function insertNewUser(userBody) {
    try {
        // Erstelle neue Instanz des User Models
        const newUser = new User(userBody);

        // Speichere neue Instanz
        return await newUser.save();

    } catch (error) {
        console.log("🚀 ~ file: user.model.js:28 ~ insertNewUser ~ error:", error)
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

// DB-Funktion zum Abrufen aller User-Eintraege
export async function getAll() {
    return await User.find();
}