const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/userModel')


module.exports = (passport) => {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const foundUser = await User.findOne({ googleId: profile.id })
                if (foundUser) {
                    return cb(null, user)
                }
                const newUser = await User.create({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value
                })
                cb(null, newUser)
            } catch (error) {
                cb(error)
            }
        }
    ))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}