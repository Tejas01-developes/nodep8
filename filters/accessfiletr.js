import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const accessfilter=(req,resp,next)=>{
const accesstoken=req.headers.authorization?.split(" ")[1];
if(!accesstoken){
    return resp.status(400).json({success:false,message:"no access token"})
}
jwt.verify(accesstoken,process.env.ACCESS_SECRET,(err,decode)=>{
    if(err){
        return resp.status(400).json({success:false,message:"error in access token filter"})
    }
    const user=decode;
    next()
})

}