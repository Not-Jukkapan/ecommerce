import express, { Express, Request, Response } from 'express'
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middleware/error';
import cors from 'cors'

const app: Express = express();

app.use(cors({
    origin: 'http://192.168.1.63:5173',
    credentials: true
}))

app.use(express.json());

app.use('/api', rootRouter)

export const prismaClient = new PrismaClient(
    { log: ['query'] }
);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`server runnign at port ${PORT} Gamuuuu`)
})