import {db} from '../Connections/Mysql.js'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { refrehtoken } from '../Connections/tokens.js';
dotenv.config();







export const insertuser=async(data,resp)=>{
    const{email,name,password,role}=data;
    const hash=await bcrypt.hash(password,10);
     const randomid=Math.floor(10000 + Math.random() * 90000)
     db.query(
         'INSERT INTO register (id,email,name,password,role,provider) VALUES (?,?,?,?,?,?)',
         [randomid,email,name,hash,role,"local"],
         (err)=>{
             if(err){
                 return resp.status(400).json({success:false,message:"db error"})
             }
             return resp.status(200).json({success:true,message:"insert success"})
         }
     )
 }



 export const googleinsert=async(data,resp)=>{
    const{email,name,id}=data;
    
     const randomid=Math.floor(10000 + Math.random() * 90000)
     db.query(
         'INSERT INTO register (id,email,name,googleid,role,provider) VALUES (?,?,?,?,?,?)',
         [randomid,email,name,id,"User","google"],
         (err)=>{
             if(err){
                 return resp.status(400).json({success:false,message:"db error"})
             }
             return resp.status(200).json({success:true,message:"insert success"})
         }
     )
 }




 export const inserttoken=async(data,resp)=>{
    const{email,refresh}=data;
     db.query(
         'INSERT INTO refresh (email,refreshtoken) VALUES (?,?)',
         [email,refresh],
         (err)=>{
             if(err){
                 return resp.status(400).json({success:false,message:"db error"})
             }
             return resp.status(200).json({success:true,message:"insert success"})
         }
     )
 }


 export const updatetoken=(data,resp)=>{
    const{refresh,email}=data
    db.query(
        'UPDATE refresh SET refreshtoken=? WHERE email =?',
        [refresh,email],
        (err)=>{
            if(err){
                return resp.status(400).json({success:false,message:"update fail"})
            }

        }
    )
 }

