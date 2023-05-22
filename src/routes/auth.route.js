import { Router } from "express";
import * as UserController from "../controller/user.controller.js";
import * as CourseController from "../controller/course.controller.js";
import * as imageService from "../service/cloudinary.service.js";



import verifyToken from "../service/jwt/jwt.verifyToken.js";

// Erstelle neue Router Instanz
const authRouter = Router();




authRouter.route('/validate-token')
    .get(verifyToken, UserController.validateUser);

// Routen Definition fuer /register
authRouter.route('/register')
    .post(UserController.registerNewUser);

authRouter.route('/register/email')
    .post(UserController.validateUserEmail);

// Routen Definition fuer /login
authRouter.route('/login')
    .post(UserController.userLogin);

// Routen Definition fuer /login
authRouter.route('/logout')
    .get(UserController.userLogout);

    // Routen Definition fuer /register
authRouter.route('/all')
    .get(CourseController.getAllCourses);

authRouter.route('/dozenten')
    .get(UserController.getAllCreators);

    authRouter.route('/addtofav')
    .put(verifyToken ,UserController.addToFav);

authRouter.route('/removefromfav')
    .put(verifyToken ,UserController.removeCourseFromUserNotes)



authRouter.route('/creator/:id')
    .get(CourseController.getCoursesByCreator);

authRouter.route('/upload')
    .post(async (req, res) => {
        const { image, folder, id } = req.body; // Extrahieren von Bild und Benutzernamen aus dem Request-Body
      
        // Hochladen des Bildes mit dem Image-Dienst
        const imgUrl = await imageService.upload(image, folder, id);
      
        // Zurückgeben der hochgeladenen Bild-URL
        res.status(200).json({ url: imgUrl });
      })

    

export default authRouter;

//c_crop,h_435,w_435/c_scale,w_300/






