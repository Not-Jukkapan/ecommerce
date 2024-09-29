import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./product";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.get('/', (req, res) => {
    res.send('Life Check');
})

rootRouter.use('/products', productsRoutes)

export default rootRouter;