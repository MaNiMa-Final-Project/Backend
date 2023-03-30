import { rolesEnum } from "../../model/role.model.js";

// Middleware-Funktion zum Authorisieren der Admins
function isAdmin(req, res, next) {
    const jwtPayload = req.tokenPayload;

// Pruefung, ob das jwtPayload-Objekt die Rolle "Admin" hat
    if (jwtPayload.role === rolesEnum.admin) {
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

export default isAdmin;