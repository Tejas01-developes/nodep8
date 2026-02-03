import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import passport from 'passport'


passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:process.env.CALL_BACK
    
}))




