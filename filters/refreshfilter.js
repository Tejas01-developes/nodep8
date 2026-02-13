import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { accesstoken } from '../Connections/tokens.js';
dotenv.config();
export const refreshfilter=(req,resp)=>{
    const rhtoken=req.cookies.refresh
  

    if(!rhtoken){
        return resp.status(400).json({success:false,message:"no refresh token"})
    }
    jwt.verify(rhtoken,process.env.REFRESH_SECRET,(err,decode)=>{
        if(err){
            return resp.status(400).json({success:false,message:"refreshfiletr error"})
        }
       
        const user=decode.email;
    
        console.log(user)
const access=accesstoken(user)
console.log("access",access)
 resp.status(200).json({success:true,access:access})

        
    })
}