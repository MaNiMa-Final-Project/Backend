import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import md5 from "md5";
import generateJsonWebToken from '../service/jwt/jwt.generateJsonWebToken.js';
import sendVerificationEmail from '../service/mailVerification.js';

import * as UserModel from "../model/user.model.js";
import { findById, findByName } from '../model/role.model.js';

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

export async function userLogin(req, res) {
    let {nameOrMail, password} = req.body;

    try {
        // Suche User per Username -> Falls nicht gefunden per Mail
        let user = await UserModel.findUserByUsername(nameOrMail);
        if (!user) {
            user = await UserModel.findUserByMail(nameOrMail);
            if (!user) throw new Error("invalid username or password", {cause: 409}) 
        }
        // Überprüfe, ob das Passwort korrekt ist
        const passwordMatches = bcrypt.compareSync(password, user.password);

        if (passwordMatches) {

            // Suche Rolle des Nutzers anhand der ID
            const userRole = await findById(user.role);

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
            
            res.send({
                success: true,
                message: `User ${user.username} logged in successfully!`,
            })

        } else throw new Error("invalid username or password", {cause: 409}) 

    } catch (error) {
        // Fehlerbehandlung
        if(!error.cause) res.status(400).send(error.message)
        else res.status(error.cause).send(error.message)
    }
}

export async function userLogout(req, res) { // Exportiere die asynchrone Funktion "userLogout", die eine Anfrage und eine Antwort als Parameter entgegennimmt

    try {
        res.clearCookie('access_token'); // Lösche das Cookie "access token"
        res.send({success: true, message: 'Logged out successfully'}); // Sende eine erfolgreiche Antwort mit einer Erfolgsmeldung

    } catch (error) {
        if(!error.cause) res.status(400).send(error.message) // Wenn der Fehler keine Ursache hat, sende eine Fehlerantwort mit dem Fehlercode "400" und der Fehlermeldung
        else res.status(error.cause).send(error.message) // Andernfalls sende eine Fehlerantwort mit dem Fehlercode, der in der Ursache des Fehlers angegeben ist, und der Fehlermeldung
    }
    }
