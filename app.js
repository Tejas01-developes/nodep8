import express, { json } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/Routes1.js';
import cookieParser from 'cookie-parser';
import router2 from './routes/Routes2.js';
// import { limit } from './Connections/ratelimit.js';



dotenv.config();
const app=express();
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(json());
// app.use(limit)






app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))
const server=http.createServer(app);

app.use("/apis",router)
app.use("/images",router2);







server.listen(process.env.PORT,()=>{
    console.log(`server started on the port ${process.env.PORT}`)
})