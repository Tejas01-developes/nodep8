import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import multer from 'multer';
import { s3 } from '../Connections/aws.js';
const storage=multer.memoryStorage();
export const upload=multer({storage});
import {db} from '../Connections/Mysql.js'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


export const uploadimage=async(req,resp)=>{
if(!req.file){
    return resp.status(400).json({success:false,message:"file is not recived"})
}
const filename=req.body.name ? req.body.name :req.file.originalname
const uniquename= `${Date.now()} - ${filename}`;

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
   'INSERT INTO images (filename,email,url,filetype) VALUES (?,?,?,?)',
   [filename,user,uniquename,req.file.mimetype],
   (err)=>{
    if(err){
        return resp.status(400).json({success:false,message:"db error of images"})
    }
   
    return resp.status(200).json({success:true,message:"image added success","url":url,"email":user})
   }
)

}catch(err){
    console.log(err)
}


}



export const getfiles=async(req,resp)=>{
    const user=req.user.email;
    if(!user){
        return resp.status(400).json({success:false,message:"no user logged in"})
    }
    db.query(
        'SELECT * FROM images WHERE email=?',
        [user],
       async (err,res)=>{
            if(err){
                return resp.status(400).json({success:false,message:"error from db for images"})
            }
            if(res.length === 0){
                return resp.status(400).json({success:false,message:"user has not uploadedd anything"})
            }
            const images=res;
        const url=await Promise.all(
            images.map(async(row)=>{
                const command=new GetObjectCommand({
                    Bucket:process.env.BUCKET_NAME,
                    Key:row.url
                })
              return  await getSignedUrl(s3,command,{expiresIn:600});
            })
        )
        
           
            
            resp.status(200).json({success:true,"url":url});
            
        }

    )
}






