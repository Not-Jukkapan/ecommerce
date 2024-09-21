import express, {Express, Request, Response} from 'express'

const app:Express = express();
const PORT = 3000

app.get('/', (req:Request, res:Response) => {
    res.send("Hi Hi Hi")
})

app.listen(PORT, () => {
    console.log(`server runnign at port ${PORT} Gamuuuu`)
})