import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import authRouter from './src/routes/auth.route.js';
import protectedRouter from './src/routes/protected.route.js';
import courseRouter from './src/routes/course.route.js';

import { connectToDb } from './src/service/db.service.js';
import { seedRoles } from './src/model/role.model.js';
import cookieParser from 'cookie-parser';

import * as imageService from './src/service/cloudinary.service.js';

//import { startMailService } from './src/service/mailVerification.js';

// Lade Umgebungsvariablen  aus der .env Datei
dotenv.config();


imageService.init();

// Initialisiere express
const app = express();

// Middleware fuer das body-Parsing
app.use(express.json({limit:"50mb"}));
app.use(cookieParser());

// Middleware fuer CROSS-ORIGIN-REQUEST
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// --------------------- ROUTES -------------------------

app.route('/')
    .get((req, res) => {
        res.status(200).json(`alles ok ${process.env.NODE_ENV}`);
      });

app.use('/auth', authRouter);

app.use('/course', courseRouter);

app.use('/protected', protectedRouter);

// Einmalig Verbindung ueber default Connection aufbauen
// es kann noch ein Callback mitgeliefert werden
await connectToDb(seedRoles);

//await startMailService();


// ----------------------------------------------------------
// Starte Server auf in der Config hinterlegtem Port
app.listen(process.env.API_PORT, () => {
    console.log(`Server is listening on http://localhost:${process.env.API_PORT}`);
});

