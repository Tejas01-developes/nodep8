import express from 'express';
import { enteruser, loginusers } from '../Service/userentry.js';
import { refreshfilter } from '../filters/refreshfilter.js';


const router=express.Router();

router.post("/register",enteruser);
router.post("/login",loginusers)
router.post("/newacc",refreshfilter);





export default router;