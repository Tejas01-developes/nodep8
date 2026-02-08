import {db} from '../Connections/Mysql.js'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { refrehtoken } from '../Connections/tokens.js';
import { resolve } from 'path';


dotenv.config();







export const insertuser=async(data)=>{
    const{email,name,password,role}=data;
    const hash=await bcrypt.hash(password,10);
    console.log(hash);
     const randomid=Math.floor(10000 + Math.random() * 90000)
     return new Promise((resolve,reject)=>{
     db.query(
         'INSERT INTO register (id,email,name,password,role,provider) VALUES (?,?,?,?,?,?)',
         [randomid,email,name,hash,role,"local"],
         (err)=>{
             if(err){
                 return reject(err)
             }
            resolve(true)
         }
     )
 }
    )}


 export const googleinsert=async(data)=>{
    
    const{email,name,id}=data;
    
     const randomid=Math.floor(10000 + Math.random() * 90000)
     return new Promise((resolve,reject)=>{
     db.query(
         'INSERT INTO register (id,email,name,googleid,role,provider) VALUES (?,?,?,?,?,?)',
         [randomid,email,name,id,"User","google"],
         (err)=>{
             if(err)
                 return reject(err)
             resolve(true)
             
         }
     )
 }

    )}


 export const inserttoken=async(data)=>{
   
    const{email,refresh}=data;
    return new Promise((resolve,reject)=>{
     db.query(
         'INSERT INTO refresh (email,refreshtoken) VALUES (?,?)',
         [email,refresh],
         (err)=>{
             if(err){
                 return reject(err)
             }
             resolve(true)
         }
     )
 }
    )}
    

 export const updatetoken=(data)=>{
   
    const{refresh,email}=data
    return new Promise((resolve,reject)=>{
    db.query(
        'UPDATE refresh SET refreshtoken=? WHERE email =?',
        [refresh,email],
        (err)=>{
            if(err)
                return reject(err)
            resolve(true)

        }
    )
 }

    )}