import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/admin";
import { addAddress, deleteAddress, listAddress } from "../controllers/usersController";


const usersRouter = Router();

usersRouter.post("/address", [authMiddleware], errorHandler(addAddress));
usersRouter.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
usersRouter.get("/address", [authMiddleware], errorHandler(listAddress));


export default usersRouter;