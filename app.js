import express, { json } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';



dotenv.config();
const app=express();
app.use(json());
const server=http.createServer(app);
app.use(cors({
    origin:process.env.FRONT_ORIGIN,
    allowedHeaders:['GET','POST','PUT','DELETE'],
    credentials:true
}))









server.listen(process.env.PORT,()=>{
    console.log(`server started on the port ${process.env.PORT}`)
})