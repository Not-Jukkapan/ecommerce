## ฝึก Node TS Express Prisma จากคลิป indian guy

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

ถัดไป เนื่องจากเราใช้ TS ดังนั้น เราจะลง Types สำหรับ node ไว้ด้วย

```
npm install @types/node --save-dev
```

ต่อไป สร้างไฟล์หลักของเรา ที่ `src/index.ts` จากนั้นไปที่ framework หลักของเรา ลง Express และ types ของ Express

```
npm i express
npm i @types/express --save-dev
```

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

### Step 6 Setup Enviroments Variables.

ในอนาคต เราจะมีการใช้ JWT ซึ่งใช้ salt เราจะเก็บ หลายๆ parameter ไว้ที่นี่ และไม่ push ไป github



### Step 7: Routes definitions

### Step 8: User Signup

### Step 9: Login and Generate JWT

### Step 10: Advanced Error Handling

### Step 11: Effortless Data Validation with Zod

### Step 12: Generic Error Handling

### Step 13 Using custom error class

### Step 14 Authentication Middleware: Decoding JWT Tokens

### Step 15 Adding different role to Users