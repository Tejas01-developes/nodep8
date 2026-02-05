import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { accesstoken } from '../Connections/tokens';
dotenv.config();
export const refreshfilter=(req,resp,next)=>{
    const refreshtoken=req.cookies.refresh

    if(!refreshtoken){
        return resp.status(400).json({success:false,message:"no refresh token"})
    }
    jwt.verify(refreshtoken,process.env.REFRESH_SECRET,(err,decode)=>{
        if(err){
            return resp.status(400).json({success:false,message:"refreshfiletr error"})
        }
        const user=decode
const access=accesstoken({user})
 resp.json({access:access})
next();
        
    })
}