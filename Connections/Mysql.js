import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


export const db=mysql.createConnection({
    port:process.env.SQL_PORT,
    host:process.env.SQL_HOST,
    user:process.env.SQL_ROOT,
    database:process.env.SQL_DATABASE,
    password:process.env.SQL_PASS
})