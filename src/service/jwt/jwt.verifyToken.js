import jwt from 'jsonwebtoken';

/**
 * Middleware-Funktion zum Überprüfen des JsonWebTokens in der Anforderung.
 * Wenn kein Token in den Anforderungskopfzeilen vorhanden ist, wird ein Fehler zurückgegeben.
 * Wenn der Token ungültig ist, wird ein Fehler zurückgegeben.
 * Wenn der Token gültig ist, wird das Payload-Objekt in der Anforderung gespeichert und der nächste Handler aufgerufen.
 * @param {Object} req - Das Anforderungsobjekt
 * @param {Object} res - Das Antwortobjekt
 * @param {Function} next - Die nächste Middleware- oder Route-Handler-Funktion
 */
function verifyToken(req, res, next) {
    if (!req.cookies.access_token) return res.status(200).send({success: false, message: 'Token missing'});
    let cookieToken = req.cookies.access_token.split(' ')[1];

    jwt.verify(cookieToken, process.env.JWT_SECRET, (err, payload) => {

        if (err) return res.status(401).send({success: false, message: 'Invalid token'});
        
        req.tokenPayload = payload;

        next();
    });
}

export default verifyToken;