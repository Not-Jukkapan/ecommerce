import { Router } from "express";
import { login, me, signup } from "../controllers/authController";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middleware/auth";


const authRoutes: Router = Router();

authRoutes.post('/signup', errorHandler(signup))
authRoutes.post('/login', errorHandler(login))
authRoutes.get('/me', [authMiddleware], me)


export default authRoutes;