import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import md5 from "md5";
import generateJsonWebToken from '../service/jwt/jwt.generateJsonWebToken.js';
import sendVerificationEmail from '../service/mailVerification.js';

import * as UserModel from "../model/user.model.js";
import { findById, findByName } from '../model/role.model.js';
import { validateAdmin, validateCreator } from '../utils/authorize.js';


// Controller Funktion zum Anlegen neuer User
export async function registerNewUser(req, res) {
    let body = req.body;

    const salt = await bcrypt.genSalt(10);
    const verificationToken = md5(salt);

    body.verificationHash = verificationToken;
    body.password = bcrypt.hashSync(body.password, 10);

    try {
        let user = await UserModel.insertNewUser(body);
        let userRole = await findByName('unverified');

        const minute = 60 * 1000;
        const hour = 60 * minute;
        const duration = hour * process.env.JWT_AND_COOKIE_DURATION_HOURS_REGISTER;

        let payload = {
            id: user._id,
            name: user.username,
            role: userRole.name
        }

        const token = generateJsonWebToken(payload, duration);

        //sendVerificationEmail(body.email, verificationToken)

        let options = {
            httpOnly: true,
            expires: new Date(Date.now() + duration)
        }

        res
        .cookie('access_token', `Bearer ${token}`, options)
        .send({
            success: true,
            message: `"Registration successful - Please check your Mails "`,
        })

    } catch (error) {
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

// Diese Funktion validiert die Anmeldedaten des Benutzers und gibt ein JWT-Token zurück, um den Benutzer zu authentifizieren
export async function userLogin(req, res) {
  // hole Benutzeranmeldedaten aus der Anfrage
  let {nameOrMail, password} = req.body;

  try {
    // finde den Benutzer anhand seines Namens oder seiner E-Mail-Adresse in der Datenbank
    let user = await UserModel.findUserByMailOrName(nameOrMail);
    
    // Überprüfe, ob das Passwort korrekt ist
    const passwordMatches = bcrypt.compareSync(password, user.password);

    if (passwordMatches) {

      // Suche Rolle des Nutzers anhand der ID
      const userRole = await findById(user.role);

      // Dauer für das Token festlegen basierend auf der Umgebungsvariablen
      const minute = 60 * 1000;
      const hour = 60 * minute;
      const duration = hour * process.env.JWT_AND_COOKIE_DURATION_HOURS_LOGIN;

      // Payload mit den Nutzerdaten für das Token
      let payload = {
          id: user._id,
          name: user.nickName,
          role: userRole.name
      }

      // Erstelle Token mit den Nutzerdaten
      const token = generateJsonWebToken(payload, duration);

      // Konfiguration für das Cookie
      let options = {
          httpOnly: true,
          expires: new Date(Date.now() + duration)
      }

      // Setze Cookie mit Token
      res.cookie('access_token', `Bearer ${token}`, options)
        
      // sende eine Bestätigungsantwort zurück an den Client inklusive Nutzer-Nachricht
      res.send({
          success: true,
          message: `User ${user.nickName} logged in successfully!`,
      })

    } else throw new Error("invalid username or password", {cause: 409}) 

  } catch (error) {
    // wenn ein Fehler auftritt, sende eine Fehlermeldung an den Client
    if(!error.cause) res.status(400).send(error.message)
    else res.status(error.cause).send(error.message)
  }
}

// Diese Funktion validiert das Benutzer-Token und gibt Informationen über den Benutzer zurück
export async function validateUser(req, res) {
  // extrahiere die Benutzer-ID aus dem Token in der Anfrage
  const userId = req.tokenPayload.id
  try {
    // finde den Benutzer anhand der ID in der Datenbank
    let user = await UserModel.findUserById(userId);

    // validiere, ob der Benutzer ein Administrator ist
    let isAdmin = await validateAdmin(user)

    // validiere, ob der Benutzer ein Creator ist
    let isCreator = await validateCreator(user)

    // erstelle die Antwort-JSON mit den Benutzerinformationen und Bestätigungswerten für Admin und Creator
    let response = {
      user: user,
      success: true,
      isAdmin: isAdmin,
      isCreator: isCreator
    }

    // sende die Antwort zurück an den Client
    res.send(response);

  } catch (error) {
    // wenn ein Fehler auftritt, sende eine Fehlermeldung an den Client
    if(!error.cause) res.status(400).send(error.message)
    else res.status(error.cause).send(error.message)
  }
}

// Diese Funktion prüft, ob sie bereits in der Datenbank existiert.
export async function validateUserEmail(req, res) {
    let email = req.body.email; // Die E-Mail-Adresse wird aus dem Body des Requests entnommen.

    try {

        let foundUser = await UserModel.verifyEmail(email); // wird in der Datenbank nach einem Benutzer mit dieser E-Mail-Adresse gesucht.
        if (foundUser) { // Wenn ein Benutzer gefunden wurde,
            res.send({success: false, message:'email in use'}); // wird eine Fehlermeldung zurückgegeben.
        } else {
            res.send({success: true, message: 'valid email'}); // Andernfalls wird bestätigt, dass die E-Mail-Adresse gültig ist.
        }

    } catch (error) { // Wenn ein Fehler auftritt,
        if(!error.cause) {
            res.status(400).send(error.message); // Bei einem Client-seitigen Fehler wird eine 400-Fehlermeldung zurückgegeben.
        } else {
            res.status(error.cause).send(error.message); // Sonst wird eine passende Fehlermeldung zurückgegeben.
        }
    }
}


export async function userLogout(req, res) {

    try {
        res.clearCookie('access_token'); // Lösche das Cookie "access token"
        res.send({success: true, message: 'Logged out successfully'}); // Sende eine erfolgreiche Antwort mit einer Erfolgsmeldung

    } catch (error) {
        if(!error.cause) res.status(400).send(error.message) // Wenn der Fehler keine Ursache hat, sende eine Fehlerantwort mit dem Fehlercode "400" und der Fehlermeldung
        else res.status(error.cause).send(error.message) // Andernfalls sende eine Fehlerantwort mit dem Fehlercode, der in der Ursache des Fehlers angegeben ist, und der Fehlermeldung
    }
}