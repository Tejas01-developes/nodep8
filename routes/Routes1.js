import express from 'express';
import { enteruser, loginusers } from '../controller/userentry.js';
import { refreshfilter } from '../filters/refreshfilter.js';
import axios from 'axios';
import dotenv from 'dotenv';
import { accesstoken, refrehtoken } from '../Connections/tokens.js';
import qs from 'qs';
import { db } from '../Connections/Mysql.js';
import { googleinsert, inserttoken, updatetoken } from '../Services/services.js';
// import { limit } from '../Connections/ratelimit.js';
dotenv.config();
const router=express.Router();

router.post("/register",enteruser);
router.post("/login",loginusers)
router.post("/newacc",refreshfilter);

router.get("/auth/google", (req, res) => {
    const googleAuthURL =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      "?response_type=code" +
      "&client_id=" + process.env.CLIENT_ID +
      "&redirect_uri=" + process.env.REDIRECT_URI +
      "&scope=openid%20email%20profile";

    res.redirect(googleAuthURL);
  });

  router.get("/auth/google/callback",async(req,resp)=>{
   
    const code = req.query.code;
if(!code){
    return resp.status(400).json({success:false,message:"no code recived"})
}
const tokenres=await axios.post("https://oauth2.googleapis.com/token",
    qs.stringify({
    code,
    client_id:process.env.CLIENT_ID,
    client_secret:process.env.CLIENT_SECRET,
    redirect_uri:process.env.REDIRECT_URI,
    grant_type:"authorization_code"
}),
{
headers:{"Content-Type": "application/x-www-form-urlencoded"}
}
); 

const{access_token}=tokenres.data;

const userres=await axios.get("https://www.googleapis.com/oauth2/v2/userinfo",{
    headers:{Authorization:`Bearer ${access_token}`,
   },
})
const{email,name,id,picture}=userres.data;

const access=accesstoken({email})
let refresh;

db.query(
  'SELECT * FROM register WHERE email=?',
  [email],
 async (err,res)=>{
    if(err){
      return resp.status(400).json({success:false,message:"db email find error"})
    }
    if(res.length === 0){
      refresh=refrehtoken(email)
      await googleinsert({email,name,id})
    }else{
   db.query(
    'SELECT * FROM refresh WHERE email =?',
    [email],
    async(err,res)=>{
      if(err){
        return resp.status(400).json({success:false,message:"db token check error"})
      }
      if(res.length === 0){
        refresh=refrehtoken(email)
        await inserttoken({email,refresh})
      }else{
      const createdat=new Date(res[0].created_at);
      const now=new Date();
      const diff=(now-createdat) / (1000 * 60 * 60 * 24)
  if(diff > 7){
    refresh=refrehtoken(email);
   await updatetoken({refresh,email},resp);
    }else{
    refresh=res[0].refreshtoken;
    }
      }
  resp.cookie("refresh",refresh,{
  httpOnly:true,
  sameSite:"Lax",
  secure:true,
  path:"/"
})
 return resp.redirect("http://localhost:5173/home");

   
   }
)
    }
  })


})
  

export default router;