import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import { connectDb } from "./src/db";
import { errMSG, MSG } from "./src/constant/message";
import userRouter from "./src/routes/user.route";
import boardRouter from "./src/routes/board.route";
import taskRouter from "./src/routes/task.route";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors({
    origin : '*',
    credentials : true
}))

const upload = multer({
    dest : 'public'
})

connectDb().then(()=>{
    app.listen(parseInt(process.env.port as string) ,()=>{
        console.log(`${MSG.serverlisten} on Port ${process.env.port}`)
    })
}).catch((error)=>{
    console.log(errMSG.connectDB);
    console.log(error.message)
})

app.use('/user', userRouter)
app.use('/board', boardRouter)
app.use('/task', taskRouter)