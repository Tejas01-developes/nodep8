import express from 'express';
import { enteruser } from '../Service/userentry.js';


const router=express.Router();

router.post("/register",enteruser);







export default router;