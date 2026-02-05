import {db} from '../Connections/Mysql.js';
import bcrypt from 'bcrypt'
import {accesstoken, refrehtoken} from '../Connections/tokens.js'



export const enteruser=async(req,resp)=>{
        const{name,email,password,role}=req.body;
        if(!name || !email || !password || !role){
            return resp.status(400).json({success:false,message:"fill all the fields"})
        }
        const randomid=Math.floor(10000 + Math.random() * 90000)
        const hash=await bcrypt.hash(password,10);
       
 db.query(
    'INSERT INTO register (id,name,email,password,role,provider) VALUES (?,?,?,?,?,?)',
    [randomid,name,email,hash,role,"local"],
    (err)=>{
        
        if(err){
           return resp.status(400).json({success:false,message:"db error"})
        }
       return resp.status(200).json({success:true,message:"user entered"})
    }
)

}

export const loginusers=(req,resp)=>{
    const{email,password}=req.body;

    db.query(
       ' SELECT * FROM register WHERE email=?',
       [email],
       (err,result)=>{
        if(err){
            return resp.status(400).json({success:false,message:"db error"})
        }
        if(result.length === 0){
            return resp.status(400).json({success:false,message:"no user with this email"})
        }
        const compare=bcrypt.compare(password,result[0].password)
        if(!compare){
            return resp.status(400).json({success:false,message:"password is incorrect"})
        }
        const access=accesstoken({email})
        const refresh=refrehtoken({email})

        db.query(
            'SELECT * FROM refresh WHERE email=?',
            [email],
            (err,res)=>{
                if(err){
                    return resp.status(400).json({success:false,message:"db error"})
                }
                if(res.length === 0){
                    db.query(
                        'INSERT INTO refresh (email,refrehstoken) VALUES (?,?)',
                        [email,refresh],
                        (err)=>{
                            if(err){
                                return resp.status(400).json({success:false,message:"db insert failed"})
                            }
                            return resp.status(200).json({success:true,message:"inserted"})
                        }
                    )
                }
               const createdtime=res[0].created_at;
               const now=new Date();
               const datetime=now.toLocaleString()
               if(createdtime - datetime >= 7){
                db.query(
                    'UPDATE refresh SET refreshtoken=? WHERE email=?',
                    [refresh,email],
                    (err)=>{
                        if(err){
                            return resp.status(400).json({success:false,message:"db update error"})
                        }
                        return resp.status(200).json({success:true,message:"update success"})
                        }
                )
               }

            }
        )

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

