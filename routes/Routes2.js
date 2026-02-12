import express from 'express';

import {  upload, uploadimage } from '../controller/filestorage.js';
import { accessfilter } from '../filters/accessfiletr.js';

const router2=express.Router();
router2.post("/upload",accessfilter,upload.single("file"),uploadimage)






export default router2