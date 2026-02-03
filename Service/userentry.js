import {db} from '../Connections/Mysql.js';
import bcrypt from 'bcrypt'

export const enteruser=async(req,resp)=>{
        const{name,email,password,role}=req.body;
        const randomid=Math.floor(10000 + Math.random() * 90000)
        const hash=await bcrypt.hash(password,10);
db.query(
    'INSER INTO register (id,name,email,password,role,provider) VALUES (?,?,?,?)',
    (randomid,name,email,hash,role,"local"),
    (err)=>{
        if(err){
            resp.status(400).json({success:false,message:"db error"})
        }
        resp.status(200).json({success:true,message:"user entered"})
    }
)

}


