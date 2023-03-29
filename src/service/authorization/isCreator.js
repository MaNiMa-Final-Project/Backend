import { rolesEnum } from "../../model/role.model.js";

// Middleware-Funktion zum Authorisieren der admins
function isCreator(req, res, next) {
    const jwtPayload = req.tokenPayload;

    if (jwtPayload.role === rolesEnum.creator) {
        next();
    } else {
        res.status(401).send({
            success: false,
            message: `User ${jwtPayload.name} is not verified`
        });
        return;
    }
}

export default isCreator;