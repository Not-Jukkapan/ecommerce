import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/admin";
import { addAddress, deleteAddress, listAddress } from "../controllers/usersController";


const usersRouter = Router();

usersRouter.post("/address", [authMiddleware, adminMiddleware], errorHandler(addAddress));
usersRouter.delete("/address/:id", [authMiddleware, adminMiddleware], errorHandler(deleteAddress));
usersRouter.get("/address", [authMiddleware, adminMiddleware], errorHandler(listAddress));


export default usersRouter;