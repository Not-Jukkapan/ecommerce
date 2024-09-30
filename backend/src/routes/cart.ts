import { Router } from "express";
import authMiddleware from "../middleware/auth";
import { errorHandler } from "../error-handler";
import { addItemCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cartController";

const cartRouter = Router();

cartRouter.post("/add", [authMiddleware], errorHandler(addItemCart));
cartRouter.get("/add", [authMiddleware], errorHandler(deleteItemFromCart));
cartRouter.delete("/add", [authMiddleware], errorHandler(changeQuantity));
cartRouter.put("/add", [authMiddleware], errorHandler(getCart));

export default cartRouter;
