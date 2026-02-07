import express from 'express';
import { enteruser, loginusers } from '../Service/userentry.js';
import { refreshfilter } from '../filters/refreshfilter.js';
import axios from 'axios';
import dotenv from 'dotenv';
import { accesstoken, refrehtoken } from '../Connections/tokens.js';
import e from 'express';
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
   
const{code}=req.query.code
if(!code){
    return resp.status(400).json({success:false,message:"no code recived"})
}
const tokenres=await axios.post("https://oauth2.googleapis.com/token",{
    code,
    client_id:process.env.CLIENT_ID,
    client_secret:process.env.CLIENT_SECRET,
    redirect_url:process.env.REDIRECT_URI,
    grant_type:"authorization_code"
})


const{access_token}=tokenres.data;

const userres=await axios.get("https://www.googleapis.com/oauth2/v2/userinfo",{
    headers:{Authorization:`Bearer ${access_token}`},
})
const{email,name,id,picture}=userres.data;

const access=accesstoken({email})
const refresh=refrehtoken({email})

resp.cookie("refresh",refresh,{
    httpOnly:true,
                    sameSite:"Lax",
                    secure:true,
                    path:"/"
})
resp.redirect("http://localhost:5173");
  })

export default router;