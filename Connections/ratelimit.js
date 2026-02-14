import rateLimit from "express-rate-limit";


export const limit=rateLimit({
    windowMs:60*1000,
    max:5,
    message:"too many request",
    standardHeaders:true,
    legacyHeaders:false
})