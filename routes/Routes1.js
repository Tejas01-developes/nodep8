import express from 'express';
import { enteruser, loginusers } from '../Service/userentry.js';


const router=express.Router();

router.post("/register",enteruser);
router.post("/login",loginusers)






export default router;