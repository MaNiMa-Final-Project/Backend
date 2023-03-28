import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDb } from './service/db.service.js';
import authRouter from './routes/auth.route.js';
import protectedRouter from './routes/protected.route.js';


// Lade Umgebungsvariablen  aus der .env Datei
dotenv.config();

// Initialisiere express
const app = express();

// Middleware fuer das body-Parsing
app.use(express.json());

// Middleware fuer CROSS-ORIGIN-REQUEST
app.use(cors({
    origin: 'http://localhost:5174',
    // credentials: true
}));



// --------------------- ROUTES -------------------------

app.use('/auth', authRouter);

app.use('/protected', protectedRouter);


// Einmalig Verbindung ueber default Connection aufbauen
// es kann noch ein Callback mitgeliefert werden
await connectToDb();

// ----------------------------------------------------------
// Starte Server auf in der Config hinterlegtem Port
app.listen(process.env.API_PORT, () => {
    console.log(`Server is listening on http://localhost:${process.env.API_PORT}`);
});