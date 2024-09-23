import { Router } from "express";
import authRoutes from "./auth";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.get('/', (req, res) => {
    res.send('Life Check');
})

export default rootRouter;