import express, { json } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import os from 'os';



dotenv.config();
const app=express();
app.use(json());

const server=http.createServer(app);








server.listen(process.env.PORT,()=>{
    console.log(`server started on the port ${process.env.PORT}`)
})