import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import multer from 'multer';
import { s3 } from '../Connections/aws.js';
const storage=multer.memoryStorage();
export const upload=multer({storage});
import {db} from '../Connections/Mysql.js'



export const uploadimage=async(req,resp)=>{
if(!req.file){
    return resp.status(400).json({success:false,message:"file is not recived"})
}
const filename=req.body.name ? req.body.name :req.file.originalname
const uniquename= `${Date.now()} - ${filename}`;
console.log(uniquename)
const params={
    Bucket:process.env.BUCKET_NAME,
    Key:uniquename,
    Body:req.file.buffer,
    ContentType:req.file.mimetype,
};
try{
await s3.send(new PutObjectCommand(params));
const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniquename}`;


const user=req.user.email;
console.log(user)
db.query(
   'INSERT INTO images (filename,email,url) VALUES (?,?,?)',
   [filename,user,url],
   (err)=>{
    if(err){
        return resp.status(400).json({success:false,message:"db error of images"})
    }
    return resp.status(200).json({success:true,message:"image added success","url":url})
   }
)

}catch(err){
    console.log(err)
}


}


