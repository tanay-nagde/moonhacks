import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import dotenv from 'dotenv';
import { UserModel } from '../models/User.model';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../utils/constants';
dotenv.config({
  path: './.env'});
// import { UserModel } from '../models/User'; // Adjust the path as per your structure

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        //console.log(profile , accessToken, refreshToken ,"from passport ___________________________________________________");
        // let user = await UserModel.findOne({ oauthId: profile.id });

        // if (!user) {
        //   user = await UserModel.create({
        //     oauthProvider: "google",
        //     oauthId: profile.id,
        //     displayName: profile.displayName,
        //     name: { firstname: profile.name?.givenName, lastname: profile.name?.familyName },
        //     email: profile.emails?.[0].value,
        //     avatar: profile.photos?.[0].value,
        //     role: "participant",
        //     isBanned: false,
        //     lastLoginAt: new Date(),
      
        //   });
        //   await user.save();
        // }

        return done(null, profile);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
