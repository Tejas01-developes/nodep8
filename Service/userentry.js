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
            refresh=refrehtoken({email})
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
                  db.query(
                    'INSERT INTO refresh (email,refreshtoken) VALUES (?,?)',
                    [email,refresh],
                    (err)=>{
                        if(err){
                            return resp.status(400).json({success:false,message:"token insert db error"})
                        }
               

                    }
                  )
                }else{
                    const createdat=new Date(res[0].created_at);
                    const now=new Date();
                    const diff=(now-createdat) / (1000 * 60 * 60 * 24)
                    if(diff > 7){
                        refresh=refrehtoken({email})
                        db.query(
                            'UPDATE refresh SET refreshtoken = ? ,created_at= NOW() WHERE email = ?',
                            [refresh,email],
                            (err)=>{
                                if(err){
                                    return resp.status(400).json({success:false,message:"errr in db token update"})
                                }
                                
                            }
                        )

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

