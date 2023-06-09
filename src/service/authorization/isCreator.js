import { rolesEnum } from "../../model/role.model.js";

// Middleware-Funktion zum Authorisieren der Creators
function isCreator(req, res, next) {
    const jwtPayload = req.tokenPayload;
    
// Pruefung, ob das jwtPayload-Objekt die Rolle "Creator" hat
    if (jwtPayload.role === rolesEnum.creator) {
        next();

// Wenn nicht, kommt Fehlermeldung        
    } else {
        res.status(401).send({
            success: false,
            message: `User ${jwtPayload.name} is not verified`
        });
        return;
    }
}

export default isCreator;