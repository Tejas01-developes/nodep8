import express, { json } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/Routes1.js';
import cookieParser from 'cookie-parser';



dotenv.config();
const app=express();
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(json());





app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))
const server=http.createServer(app);

app.use("/apis",router)








server.listen(process.env.PORT,()=>{
    console.log(`server started on the port ${process.env.PORT}`)
})