import {db} from '../Connections/Mysql.js';
import bcrypt from 'bcrypt'
import {accesstoken, refrehtoken} from '../Connections/tokens.js'
import { inserttoken, insertuser, updatetoken } from '../Services/services.js';





export const enteruser=async(req,resp)=>{
    const{name,email,password,role}=req.body;
    if(!name || !email || !password || !role){
        return resp.status(400).json({success:false,message:"fill all the fields"})
    }
    
   
insertuser({name,email,password,role},resp)

}







export const loginusers=async(req,resp)=>{
    const{email,password}=req.body;

   db.query(
       ' SELECT * FROM register WHERE email=?',
       [email],
      async (err,result)=>{
        if(err){
            return resp.status(400).json({success:false,message:"db error"})
        }
        if(result.length === 0){
            
            return resp.status(400).json({success:false,message:"no user with this email"})
        }
        const compare=await bcrypt.compare(password,result[0].password)
        if(!compare){
            return resp.status(400).json({success:false,message:"password is incorrect"})
        }
        const access=accesstoken({email})
       let refresh;
       
        db.query(
            'SELECT * FROM refresh WHERE email=?',
            [email],
            (err,res)=>{
                if(err){
                    return resp.status(400).json({success:false,message:"token db error"})
                }
                if(res.length === 0){
                    refresh=refrehtoken({email})
             inserttoken({email,refresh},resp)
                }else{
                    const createdat=new Date(res[0].created_at);
                    const now=new Date();
                    const diff=(now-createdat) / (1000 * 60 * 60 * 24)
                    if(diff > 7){
                        refresh=refrehtoken({email})
                      updatetoken({refresh,email},resp)

                    }else{
                        refresh=res[0].refreshtoken
                    }
                }
                resp.cookie("refresh",refresh,{
                    httpOnly:true,
                    sameSite:"Lax",
                    secure:true,
                    path:"/"
                })
                return resp.status(200).json({success:true,message:"login success",access:access})

            }
        )
    

       }
    )
}

