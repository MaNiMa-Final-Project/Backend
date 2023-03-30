import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './src/routes/auth.route.js';
import protectedRouter from './src/routes/protected.route.js';

import { connectToDb } from './src/service/db.service.js';
import { seedRoles } from './src/model/role.model.js';
import cookieParser from 'cookie-parser';
//import { startMailService } from './src/service/mailVerification.js';

// Lade Umgebungsvariablen  aus der .env Datei
dotenv.config();

// Initialisiere express
const app = express();

// Middleware fuer das body-Parsing
app.use(express.json());
app.use(cookieParser());

// Middleware fuer CROSS-ORIGIN-REQUEST
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));

// --------------------- ROUTES -------------------------

app.use('/auth', authRouter);

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

