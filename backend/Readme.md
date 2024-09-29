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
- ตอนนี้ เมื่อมี Error เราจะ Throw ซึ่งนั้นอาจจะไม่ใช่วิธีในการจัดการที่ดีมากนัก
```ts
Throw new Error('User not Found')
```
ถึงเวลาที่จะ work กับ `exceptions`

สร้าง `/exceptions/root.ts` เพื่อเป็น เรามา list ว่าเราต้องการจะส่งอะไรบ้างเวลา Error
- message เช่น พวก error message ว่าเกิดอะไรขึ้น
- statusCode พวก HTTP status มั้วไป 401, 404
- errors code ไว้ให้ Frontned เอาไปใช้
- error
```ts
export class HttpExceptions extends Error{
  message: string;
  errorCode: any;
  statusCode:number;
  error: any;
  constructor(message: string, errorCode:any, statusCode:number, error:any) {
    super(message)
    this.message = message
    this.errorCode =errorCode
    this.statusCode = statusCode
    this.error = error
  }
}

export enum ErrorCodes {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 3001
}

``` 

จากนั้น เราสร้าง Custom Error สำหรับสถานการณ์ต่างๆ ได้ เช่น Bad Request ตัวอย่างนี้เราจะใช้กับ User not f
```ts
export class BadRequest extends HttpException {
    constructor(message: string, errorCode: ErrorCodes) {
        super(message, 400, errorCode, null);
    }
}
```

และนำไปใช้งานใน Controller แทนที่ การ Thorw Error แบบเก่า ให้มัน Struct
```ts
//แบบเก่า
if(user) throw new Error('User not Found')

//แบบใหม่
if(user) throw new BadRequest('User Already exist', ErrorCode.USER_ALREADY_EXISTS)
```

จากนั้น สร้าง Middleware มารองรับ เมื่อเกิดการ throw Error ขึ้นมา `middleware/errors.ts` เราจะดัก Error ตรงนี้ แล้วจัด format สำหรับ response error ไปให้ client ตรงนี้
```ts
export errorMiddleware = (error: HttpException, req:Request, res:Response, next:NextFucntion) => ({
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors
  })
})
```
จากนั้นนำ `middleware errors.ts`  ไปใช้ ที่ท้ายสุดในหน้า **index.ts** เพระาเอาไว้ดัก

```ts
// this position show it only above app.listen one level.
app.use(errorMiddleware);

app.listen ...
```

เมื่อ setup ตามนี้สำเร็จ 
ใน controller อย่าลืม args next ไปตรงที่เรา throw Error ใช้ next แทน thorw Error
```ts
if(user)  next(new BadRequest('User Already exist', ErrorCode.USER_ALREADY_EXISTS))
```

### Step 11: Effortless Data Validation with Zod

ก่อนไป Topic อื่น มา Validate inupt field กันก่อน โดยใช้ Zod validate TS
```
npm i zod
```
จากนั้นสร้าง `schema/users.ts` ไว้เช็ค input type that related to action about users like Craete User, Update User , .... etc.
```ts
import {z} from zod
const SignupSchema =z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string().min(8)
})
```

จากนั้นเราไปสร้าง Custom Error เกี่ยวกับการ validate กันต่อ `exceptions/validate.ts` ตั้งชื่อ `class UnprocessableEntity`ให้ main มันเป็น base สำหรับ error ที่เกิดจากการ validate.
```ts
export class UnprocessableEntity extends HttpException {
  constructor(message:stirng, error:any, errorCode:ErrorCodes) {
    super(message, errorCode, 422, error)
  }
}
```
จากนั้นการใช้งาน ใน Controller function เรา Check ใน try บนสุดเลย ถ้าผ่านค่อยไปทำอย่างอื่น หน้าตามันจะประมาณนี้ สังเกตุว่าพอเกิด Error จาก การ validate มันจะวิ่งไปที่ catch แล้ว execute ตัว **UnprocessableEntity**
```ts
try{
 SignupSchema.parse(req.body)
 const {email, password, name} = req.body;
 let user = await prismaClient.user.findFirst({where:{email}})
 if(user) next(new BadRequest("User already exists!", ErrorCode.USER_ALREADY_EXISTS))
 user = await prismaClient.user.create({
 data:{
  name, email, password; hashSync(password, 10)
 }
})
res.stat(200).json(user)
}catch(error:any){
  next(new UnprocessableEntity(err?.issues,"Unprocessable entity", ErrorCodes.UNPROCESSABLE_ENTITY))
}
```
ในกรณีนี้ error อะไรที่มัน throw มาแล้วไม่มีใครรับ (ไม่ได้ next ไปไหน มันจะเข้าไปที่ UnprocessableEntity หมด) จริงๆ เราควร check like
```ts
if(error instanceof ZodError) then do ... 
// else internal server error 500 something like this.
```

### Step 12: Mastering Generic Error Handling | Higher order function with Try and Catch

จากเดิมที่เราใช้ Try Catch จัดการกับ errorr บ่อยๆ ซึ่งมันทำซ้ำมากๆ เราสามารถรวบมันเป็น Higher order function ที่รับ method(Logic) ของ controller function เก่า และ try catch จัดการ error ไว้ข้างในได้ แล้วเรา pass only Method(Logic) สำหรับ controller ตัวนั้นๆ สร้าง `src\error-handlers.ts` Function นี้จะห่อ method เอาไว้ แล้ว return เป็น controller function.
```ts
// รับ method ของ controller function เดิท as args
export const errorHandler = (method:Fucntion) =>{
  // return controller function (basically middleware)
  return (req:Request, res:Response, next:NextFunciton) =>{
    //try-catch like traditional controller funciotn
    try{****
      method(req, res,next);
    }catch(error:any) {
        let exception: HttpException;
        if (error instanceof ZodError) {
          ...
        } else if (error instanceof HttpException) {
          ...
        } else {
          ...Internal Error
        }
    }
  }
}
```
หลังจากเรา defined ตัว error-handlers เสร็จแล้ว ไปที่หน้า routes กัน `src/routes/authRoutes.ts`
```ts
// wrap controller function with our error-handler()
// from
authRoutes.post('/signup', signup)

// to
authRoutes.post('/signup', errorHandler(signup))
```
และเข้าไปแก้ controller function เก่าเรา เอาพวก try...catch... ออก จาก
```ts
// จาก
export const signup = async (req: Request, res: Response, next:NextFunction) => {
  try{
  SignupSchema.parse(req.body);
    const { email, password, name } = req.body;

    // check user exists
    let user = await prismaClient.user.findUnique({
        where: { email }
    });
    if (user) {
        next(new BadRequest('User already exists', ErrorCodes.USER_ALREADY_EXISTS))
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
  } catch(error:any) {
    next(...Some Error function that we check like validate or other then internal server error.)
  }

}

// เราจะแก้เป็น
export const signup = async (req: Request, res: Response) => {
    SignupSchema.parse(req.body);
    const { email, password, name } = req.body;
    // check user exists
    let user = await prismaClient.user.findUnique({
        where: { email }
    });
    if (user) {
        throw new BadRequest('User already exists', ErrorCodes.USER_ALREADY_EXISTS)
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
สังเกตุว่า  เราเอา `Next Function` ออกสำหรับ` Error` แล้วเรากลับมาใช้ throw แทน `เพราะว่าเราทำ condition error contorl ตรง catch ใน error-handler.ts ไว้แล้ว` error ที่เรา thorw จะไปจัดการตรงนั้นแทน 
```ts
try{...}
catch (error: any) {
      let exception: HttpException;
      if (error instanceof ZodError) {
        exception = new UnprocessableEntity(error, 'Validation Error', ErrorCodes.UNPROCESSABLE_ENTITY);
      }
      else if (error instanceof HttpException) {
        exception = error;
      } else {
        exception = new InternalException('Internal Server Error', ErrorCodes.INTERNAL_EXCEPTION, error.message);
      }
      next(exception);
    }
```

ิอย่าลืม `async..await..`ที่ `error-handler.ts function` ด้วย
```ts
export const errorHandler = async (method:Fucntion) =>{
  return (req:Request, res:Response, next:NextFunciton) =>{
    try{****
      await method(req, res,next);
    }catch(error:any) {
     
    }
  }
}
```
### Step 13 Using custom error class
เรา Test กับ Signup ไปแล้ว ต่อไป ไปที่ login
สร้าง custom error สำหรับ not-found ขึ้นมา
```ts
import { ErrorCodes, HttpException } from "./root";

export class NotFoundException extends HttpException {
    constructor(message:string, errorCode:ErrorCodes) {
        super(message, 404, errorCode, null);
    }
}
```
เอาไปใช้ เวลา login แล้วหาข้อมูล user ไม่เจอ ก็ throw Error ไปซะ เป็นชาวแก๊ง not-found
```ts
export const login = async (req: Request, res: Response) => {
    LoginSchema.parse(req.body);
    const { email, password } = req.body;

    // check user exists
    let user = await prismaClient.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new NotFoundException('User does not exists', ErrorCodes.USER_NOT_FOUND);
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequest('Invalid password', ErrorCodes.INCORRECT_PASSWORD);
    }

    const token = jwt.sign({
        userId: user.id,
    }, JWT_SECRET)

    res.json({ user, token });
}
```
### Step 14 Authentication Middleware: Decoding JWT Tokens
ต่อไป เราจะเริ่มเข้าสู่เรื่อง JWT กันแล้ว [การใช้งาน JWT borntodev](https://www.borntodev.com/2023/11/01/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B8%B2%E0%B8%99-jwt-json-web-tokens-%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3-authentication/)

ในขี้นตอน เราจะมาดูว่า authMiddleware มันทำงานยังไงกัน
ไอเดียคือ เราสร้าง `api /me` ซี่งจะ return ข้อมูลของ user base on token ที่เราแปะมากับ header สำหรับทุก request.
เพิ่มเติม `loginController` เราก่อน 
```ts
// เดิม 
export const login =  (req:Request, res:Response) => {
  LoginSchema.parse(req.body)
  const {email, password} = req.body;
  let user = await prismaClient.user.findUnique({where:{email}})
  if(!user) {
    throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND)
  }
  if(!compareSync(password, user.password)){
    thorw new BadRequestException('Incorrect Password'. ErrorCode.INCORRECT_PASSWORD)
  }

  res.status(200).json({user, token})
}
```
ก่อนหน้านั้น เราสร้างตัว boiler plate `middleware/auth.ts`
```ts
import { NextFunction, Request, Response } from "express";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

} 
export default authMiddleware;
```
และสร้าง custom error class สำหรับ `Unautorize user` ที่ไม่ได้ login แต่พยายามเหลือเกินที่จะเข้ามา request ขอข้อมูล
```ts
import { HttpException } from "./root";

export class UnauthirizedException extends HttpException{
    constructor(message: string, errorCode: number, error?: any) {
        super(message, 401, errorCode, error);
    }
}
```
กลับมาที่ `authMiddleware` เราไอเดียในการใช้ Token กับ ปกป้อง routes จะอารมณ์ประมาณนี้
- 1. แกะเอา token ออกมาจาก header ก่อน
- 2. ถ้าไม่มี Token มากับ Header เตะไปก่อนเลย `throw new UnauthorizaedException`
- 3. ถ้ามี Token, Verify token นั้นก่อน ว่าใช่ไหม ถ้าใช่ ก็ Expract payload นั้น
- 4. แกะเอาข้อมูล User จาก Payload นั้น
- 5. แปะข้อมูลของ user ที่เราแกะมา เข้าไปใน request object ที่เราใช้อยุ `req.user = payload.user`

We can Follow this for working with req.user = payload.user as any work

```ts
import { NextFunction, Request, Response } from "express";
import { UnauthirizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // 1. extract the token from the request header
    const token = req.headers.authorization;
    // 2. if token not present, thorw an error of unautorized
    if (!token) {
        // ใช้ next ไม่ใช่ thorw เพราะว่าเราใช้ middleware ไม่ได้ wrap มันด้วย error handler ที่เราสร้างไว้
        next(new UnauthirizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    }
    try {
        // 3. if token is present, verify the token and extract the payload
        const payload: {userId:number} = jwt.verify(token!, JWT_SECRET) as any;
        // 4. to get the user from the payload
        const user = await prismaClient.user.findUnique({ where: { id: payload.userId } })
        if(!user){
            next(new UnauthirizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
        }
        // 5. to attact the user to the current request object.
        req.user = user;
        
    } catch (error: any) {
        next(new UnauthirizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    }

}
export default authMiddleware;
```

### Regarding the issues with attach the user to the current request object

```
It worked for me by doing the following steps:

1. The first thing we need to do is to create a new declaration file @types > express > index.d.ts in the root of our project.

2. Next we need to make some few changes in the project's tsconfig.json file.
...
"typeRoots": [
      "@types",
      "./node_modules/@types",
    ]                    
...

3. Add our custom user property to Express's Request interface type by modifying the index.d.ts file we created earlier:

import { User } from "@prisma/client";

declare global{
    namespace Express {
        interface Request {
            user: User
        }
    }
}

4. last step in the authMiddleware, tells the compiler to treat the value of user as if it were of type any:

req.user= user as any;
```
### Step 15 Adding different role to Users

เราจะมาสร้าง Roles Base กัน อันดับแรก modify roles ใน `prisma schema` กันก่อน

```ts

enum Role{
  ADMIN
  USER
}

model User{
  id Int @id @default(autoincrement())
  name String
  email String @unique
  password String
  role Role @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

```

จากนั้น Prisma Migrate อัพเดท Table ก่อนหน่อย
```
npx prisma migrate dev --name AdoRolesToUser
```

ใช้ Prisma Studio ลองเข้าไปดู และเปลี่ยน role เล่นดู
```
npx prisma studio
```


### Step 16 Admin Middleware: Role-Based Access Control

มาดูว่าเราจะทำ role base access กันยังไง แต่ก่อนหน้านั้น ไปสร้าง table Product ก่อน เพื่อใช้งานกับ routes ใหม่ที่จะกำหนดสิทธิ

```ts
model Product {
  id Int @id @default(autoincrement())
  name String
  description String
  price Decimal
  tags String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("products")
}
```

และสร้าง `controller/productController.ts` กับ `routes/product.ts` ขึ้นมา เพื่อใช้งานกับ routes ที่เช็ค roles base เพิ่ม routes ของ product ไปที่หน้า index.ts ของ routes
```ts
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
```

สร้าง Table
```
npx prisma migrate dev --name AddProductTable
```
Update Controller สำหรับ Create Product โดยตรง tags ที่รับมาเป็น array เราจะเก็บเป็น String แทน จากนั้นทดลองสร้าง product ดู
```ts
export const createProduct = async (req: Request, res: Response) => {

    // our tags ["tea","india"] => "tea,india"

    // Create a validator to this request

    const product = await prismaClient.product.create({
        data:{
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })

    res.json(product)

}

```
ทดลองดู
```json
{
    "name":"tea",
    "description":"A sweet tea",
    "tags":["tea", "india"],
    "price":20
}
```

จากนั้นลองมา Test ใช้กับ authMiddleware กัน Check ว่าต้องม Token ต้อง OK ถึง Create ได้

```ts
// จาก
productsRoutes.post('/', errorHandler(createProduct))
// เป็น
productsRoutes.post('/', [authMiddleware],errorHandler(createProduct))
```

ต้องได้ ถ้าไม่ใส่ token
```json
{
    "message": "Unauthorized",
    "errorCode": 4001
}
```

 และหลังใส่ใน header ต้องสามารถ create product ได้

 จากนั้นไปลุยกัน `rolesMiddleware` โดยสร้าง `middleware/admin.ts`

 ```ts
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { UnauthirizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";

export interface AuthenticatedRequest extends Request {
    user?: User
}

const adminMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user
    if (user?.role == "ADMIN") {
        next()
    } else {
        next(new UnauthirizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    }
}

export default adminMiddleware;
 ```

 จากนั้น เอา authMiddleware ไป chain กันต่อ ที่หน้า `productRoutes`
 
 ```ts
productsRoutes.post('/', [authMiddleware, adminMiddleware],errorHandler(createProduct))
 ```

ลอง login และใช้ token ไป Create Product ดู มันต้องไม่ได้
หลังจากนั้น เข้า prisma studio เพื่อความสะดวก ไปแก้ Roles สักตัวเป็น admin แล้ว login และใช้ token ของตัวนั้น ไปสร้าง Product มันจะต้องได้
```
npx prisma studio
```

### Step 17 Finising all produt routes in E-Commerce App

Update Dummy `controller/productComtroller.ts` ไว้ก่อน พวก basic CRUD
```ts

export const updateProduct = async (req: Request, res: Response) => {

}
export const deleteProduct = async (req: Request, res: Response) => {

}
export const listProducts = async (req: Request, res: Response) => {

}
export const getProductByIdt = async (req: Request, res: Response) => {

}

```

จากนั้น อัพเดท `routes/product.ts` ด้วย controller พวกนี้ และแน่นอน อย่าลืมโยน Middleware ให้แต่ละ route
```ts
import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/productController";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/admin";

const productsRoutes: Router = Router()

productsRoutes.post('/', [authMiddleware, adminMiddleware],errorHandler(createProduct))


productsRoutes.put('/:id', [authMiddleware, adminMiddleware],errorHandler(updateProduct))

productsRoutes.delete('/:id', [authMiddleware, adminMiddleware],errorHandler(deleteProduct))

productsRoutes.get('/', [authMiddleware, adminMiddleware],errorHandler(listProducts))

productsRoutes.get('/:id', [authMiddleware, adminMiddleware],errorHandler(getProductById))
export default productsRoutes

```

จากนั้น Update Product Model ใน Prisma ตรง **description** เนื่องจาก String ใน MySQL มันจะ จำกัดจำนวน Text เราใส่ @db.Text เพื่อให้มัน Unlimited แต่ถ้าใช้ `PostgreSQL` ไม่ต้องทำงี้

``` ts
// จาก
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Decimal
  tags        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}

// เป็น
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String   @db.Text
  price       Decimal
  tags        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}
```
รัน migrate  เพื่อ แก้ไข table
```
prisma migrate dev --name xxxxx
```

แล้วไปทำ Controller ให้เสร็จ
```ts
import { NextFunction, Request, Response } from "express"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCodes } from "../exceptions/root"
import { Schema } from "zod"
import { CreateProductSchema, UpdateProductSchema } from "../schema/product"

export const createProduct = async (req: Request, res: Response) => {
    // our tags ["tea","india"] => "tea,india" -> using join
    // Create a validator to this request
    CreateProductSchema.parse(req.body);

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(product)
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        UpdateProductSchema.parse(req.body);
        const product = req.body
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        const updateProduct = await prismaClient.product.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: product
        })
        res.json(updateProduct)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }

}
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        const deleteProduct = await prismaClient.product.delete({
            where: {
                id: parseInt(req.params.id)
            },

        })
        res.json(deleteProduct)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }
}
export const listProducts = async (req: Request, res: Response) => {
    // For pagination like 
    //{ "offset": 0,count: 100}
    //     "limit": 10,}

    const count = await prismaClient.product.count()
    const products = await prismaClient.product.findMany({
        skip: +req.query.skip! | 0,
        take: +req.query.limit! | 10
    })
    res.json({ count, products })

}
export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.json(product)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }
}
```

และอย่าลืม `validate`
```ts
import {z} from 'zod';

export const CreateProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(0),
    price: z.number().min(1),
    tags: z.array(z.string())
})

export const UpdateProductSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(0).optional(),
    price: z.number().min(1).optional(),
    tags: z.array(z.string()).optional()
})
```

### Step 18 Adding Address table to E-Commerce App

สร้าง Model Address แล้วไป Map User