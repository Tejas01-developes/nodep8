import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import multer from 'multer';
import { s3 } from '../Connections/aws';
const storage=multer.memoryStorage();
const upload=multer({storage});


export const uploadimage=async(req,resp)=>{
if(!req.file){
    return resp.status(400).json({success:false,message:"file is not recived"})
}
const filename=req.body.name ? req.body.name :req.file.originalname
const params={
    Bucket:process.env.BUCKET_NAME,
    Key:filename,
    Body:req.file.buffer,
    ContentType:req.file.mimetype,
};

await s3.send(new PutObjectCommand(params));
const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

}