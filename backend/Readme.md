## ฝึก Node TS Express Prisma จากคลิป indian guy

All credits give to [@Evoqys](https://www.youtube.com/watch?v=qrSE1MCPvuU&list=PLaY6YJMqp51dW3zHhw0Iqy8hI86SKI8n-) from youtube
Thanks for lifesaver!!

### Step 1 : Setup project

```
npm init -y
```

เพื่อ initailize project ต่อไป เริ่ม install dependency

เนื่องจาก TS ใช้เฉพาะตอน dev เมื่อ prod เรา compile เป็น JS ไปใช้งานอยุละ

```
npm install typescript --save-dev
```

ต่อไป initailze project เป็น ts

```
npx tsc --init
```

จะได้ไฟล์ tsconfig.json ที่ hold configuration ต่างๆ สำหรับ TS ไว้
****
ถัดไป เนื่องจากเราใช้ TS ดังนั้น เราจะลง Types สำหรับ node ไว้ด้วย

```
npm install @types/node --save-dev
```

ต่อไป สร้างไฟล์หลักของเรา ที่ `src/index.ts` จากนั้นไปที่ framework หลักของเรา ลง Express และ types ของ Express

```
npm i express
npm i @types/express --save-dev
```
---
### Step 2 : Initialising Express App

ท่ามาตรฐาน สำหรับ express

```ts
import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (res, req) => {
  res.send("Hi Hi Hi");
});

app.listen(PORT, () => {
  console.log(`server runnign at port ${PORT}`);
});
```

ถัดไป จะทดสอบ run แต่เนื่องจาก มันไม่ใช่ ๋ js จำเป็นที่จะต้อง ลง lib ts-node เพื่อจัดการ และลง nodemon เพื่อ hot reload

```
npm install ts-node nodemon --save-dev
```

ถัดไป สร้าง nodemon.json ที่ `root/nodemon.json` เพื่อจัดการ configuration files

```json
{
  "watch": ["src"],
  "ext": ".js,.ts",
  "exec": "npx ts-node ./src/index.ts"
}
```

จากนั้นไปอัพเดท package.json

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "npx nodemon"
  },
```
---
### Step 3 Directory structure: Creating folder strucutre of app

ก่อนอื่น เนื่องจากเราใช้ ts เรา import type มาใช้ก่อน

```ts
import express, { Express, Request, Response } from "express";

const app: Express = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hi Hi Hi");
});

app.listen(PORT, () => {
  console.log(`server runnign at port ${PORT} Gamuuuu`);
});
```

และสร้าง folder `src/controllers`, `src/exceptions`, `src/middleware`, `src/routes` and `src/schema`
---
### Step 4 : Initialising Prisma in Express app.

```
npm i prisma @prisma/client
```

หลังจากติดตั้งเสร็จ สร้าง directory สำหรับ prisma โดยคำสั่ง

```
npx prisma init
```

จะเห็น `root/prisma/schema.prisma` โดย default จะใช้ `progresql` โดยเราจะเปลี่ยนเป็ฯ `mysql`

จากนั้นทำการสร้าง database และแก้ไข url ในส่วนของ .env file
---
### Step 5 : Creating User model

สร้าง model User ใน prisma.schema keep it simple ค่อยเพิ่มข้อมูลอื่นทีหลัง

```ts
model User{
  id Int @id @default(autoincrement())
  name String
  email String @unique
  password String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

จากนั้น ทำการ migrate prisma เข้ากับ mysql และอย่าลืมตั้งชื่อการ migrate ไว้ช่วยจำด้วย
```
npx prisma migrate dev --name CreateUsersTable
```
---

### Step 6 Setup Enviroments Variables.

ในอนาคต เราจะมีการใช้ JWT ซึ่งใช้ salt เราจะเก็บ หลายๆ parameter ไว้ที่นี่ และไม่ push ไป github
ลง packeage เพื่อนเข้าถึงไฟล .env
```
npm install dotenv
```

จากนั้น สร้างไฟล์ `src/secrets.ts` 
```ts
import dotenv from  'dotenv'

dotenv.config({
    path:'.env'
})

export const PORT = process.env.PORT
```

in `.env` we add port 

```
PORT = 3000
```

ทดลองใช้งาน PORT ที่ `src/index.ts` 
```ts
import express, {Express, Request, Response} from 'express'
import { PORT } from `./secrets`

const app:Express = express();

app.get('/', (req:Request, res:Response) => {
    res.send("Hi Hi Hi")
})

app.listen(PORT, () => {
    console.log(`server runnign at port ${PORT} Gamuuuu`)
})
```
ทดสอบ `npm start` มันจะต้อง run ได้ปกติ ที่ `PORT 3000`

สำหรับการใช้งานจริง เราจะสร้างไฟล์ตัวอย่างเช่น `.env.example` ไว้ และใส่รายละเอียด เช่น 

```
PORT =somePortNumber
```
---
### Step 7: Routes definitions

เราจะมา defined `authRoutes` กัน ในที่นี้คือ `login` และ `signup` 

สร้าง `routes/auth.ts` 
ใช้ **Router class** สำหรับ split routes to other file
```ts
import {Router} from 'express'
import {login} from '../controllers/auth'
const authRoutes:Router =Router()

authRoutes.get('/login', login)

export default authRoutes
```

สร้าง Dummy controller มาใช้เพื่อ Callbacks `src/controller/authController.ts` และอย่าลืม Type ** Request, Response**
```ts
import {Request, Response} from 'express'
export const login = (req, res) => {
    res.send("Login Work!!")
}
```

ในอนาคตจะมีการสร้าง Route เพิ่มเช่นสำหรับ **Products**, **Order** ดังนี้นเรา Combine Route เข้าด้วยกันเพิ่มความสะดวกโดย สร้าง `src/routes/index.ts`
```ts
import {Router} form 'express'
import authRoutes from "./auth"

const rootRouter:Router = Router()

rootRouter.use('/auth',authRoutes)

export default rootRouter
```

จากนั้น แก้ Route Call ทั้ `src/index.ts` 
```ts

import express, { Express, Request, Response } from 'express'
import { PORT } from './secrets';
import rootRouter from './routes';

const app: Express = express();

app.use('/api', rootRouter);

app.listen(PORT, () => {
    console.log(`server runnign at port ${PORT} Gamuuuu`)
})

```

ทดสอบที่ `get /api/auth/login` ต้องแสดง `Login Work!!`

---
### Step 8: User Signup
จะมาทำ login auth กัน แต่ก่อนหน้านั้น เราต้องทำ prismaClient ก่อน ณ ที่นี้ ประกาศไว้หน้า `src/index.ts` ละกัน

```ts
import express, { Express, Request, Response } from 'express'
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';

const app: Express = express();

app.use('/api', rootRouter)

export const prismaClient = new PrismaClient(
    { log: ['query'] }
);

app.listen(PORT, () => {
    console.log(`server runnign at port ${PORT} Gamuuuu`)
})
```

จากนั้นไปที่ authControllers เราจะใช้ lib เพิ่ม 2 ตัว `bcrypt, jsonwebtoken`
```
npm install bcrypt jsonwebtoken
```
ลง Types ด้วย
```
`npm i --save-dev @types/bcrypt`
```


แก้ไข `authController` 
- import prismaClient
- destructuring req.body
- checkUser is exist ?
- if yes throw error
- create users
```ts
import { Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync } from 'bcrypt';

export const signup = async (req: Request, res: Response) => {

    const { email, password, name } = req.body;

    // check user exists
    let user = await prismaClient.user.findUnique({
        where: { email }
    });
    if (user) {
        throw new Error('User already exists');
    }

    user = await prismaClient.user.create({
        data:
        {
            name,
            email,
            password: hashSync(password, 10)
        }
    })
    res.json(user);
}
```

จากนั้น แก้ไข authRoutes ให้สอดคล้องกับ `signup()`


---
### Step 9: Login and Generate JWT

Idea จะคล้ายๆ กับก่อนหน้านี้ Copy มาก่อนเลย แล้วแก้ไขเงื่อนไขการเช็ค
- ถ้าไม่มี user เรา Throw Error 
- จากนั้น `import compareSync` มาใช้ Check req.password กับ hash password เราตรงกันไหม
- ถ้าไม่ Throw new Error again
- res JWT ไปใน object ด้วย ให้ **Client**
- สร้าง JWT SECERT ไว้

```ts
import { Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from 'bcrypt';

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    // check user exists
    let user = await prismaClient.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error('User does not exists');
    }

   if()
    res.json(user);
}
```

### Step 10: Advanced Error Handling

### Step 11: Effortless Data Validation with Zod

### Step 12: Generic Error Handling

### Step 13 Using custom error class

### Step 14 Authentication Middleware: Decoding JWT Tokens

### Step 15 Adding different role to Users