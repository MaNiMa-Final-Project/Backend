import { rolesEnum } from "../../model/role.model.js";

// Middleware-Funktion zum Authorisieren der admins
function isAdminOrCreator(req, res, next) {
    const jwtPayload = req.tokenPayload;

// Pruefung, ob das jwtPayload-Objekt eine Rolle hat, die entweder "Admin" oder "Creator" ist    
    if (jwtPayload.role === rolesEnum.admin || jwtPayload.role === rolesEnum.creator) {
        next();

// Wenn das jwtPayload-Objekt jedoch keine gueltige Rolle hat, wird Fehlermeldung  gesendet        
    } else {
        res.status(401).send({
            success: false,
            message: `User ${jwtPayload.name} is not verified`
        });
        return;
    }
}

export default isAdminOrCreator;