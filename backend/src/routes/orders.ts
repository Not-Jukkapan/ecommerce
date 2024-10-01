import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middleware/auth";
import { cancelOrder, createOrder, getOrderById, listOrder } from "../controllers/orders";


const orderRoutes = Router();

orderRoutes.post("/", [authMiddleware], errorHandler(createOrder));
orderRoutes.get("/", [authMiddleware], errorHandler(listOrder));
orderRoutes.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));
orderRoutes.get("/:id", [authMiddleware], errorHandler(getOrderById));


export default orderRoutes;