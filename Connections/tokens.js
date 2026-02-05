import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const accesstoken=(user)=>{
    return jwt.sign(
    {email:user.email},
    process.env.ACCESS_SECRET,
    {expiresIn:'15m'}
    )
}

export const refrehtoken=(user)=>{
return jwt.sign(
    {email:user.email},
    process.env.REFRESH_SECRET,
    {expiresIn:'7d'}
)
}


