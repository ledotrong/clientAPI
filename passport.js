const passport = require('passport');
const passwordJWT = require('passport-jwt');
const ExtractJWT = passwordJWT.ExtractJwt;
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passwordJWT.Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var config = require('./config/index');
require('dotenv').config();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, cb) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return cb(null, false, { message: 'Incorrect email or password.' });
        }

        validatePass = await bcrypt.compare(password, user.password);
        if (!validatePass)
          return cb(null, false, {
            message: 'Incorrect email or password.'
          });
        else
          return cb(null, user, {
            message: 'Logged In Successfully'
          });
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET
    },
    async (jwtPayload, cb) => {
      console.log("thyyyyyyyy", jwtPayload);
      try {
        const user = await User.findById(jwtPayload._id === undefined? jwtPayload.userID : jwtPayload._id);
        console.log("thyyyyyyyy", jwtPayload._id);
        if (!user) {
          return cb(null, false);
        } else {
          return cb(null, user);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
passport.use(new FacebookTokenStrategy({
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret
},
function (accessToken, refreshToken, profile, done) {
  console.log("hello");
  User.findOne({
    'facebookProvider.id': profile.id
  }, function(err, user) {
    // no user was found, lets create a new one
    
    if (!user) {
      console.log(profile);
        var newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            skills: [],
            address: "undefined",
            role: "undefined",
            password: "undefined",
            facebookProvider: {
                id: profile.id,
                token: accessToken
            },
            activated: false
        });
  
        newUser.save(function(error, savedUser) {
            if (error) {
                console.log(error);
            }
            return done(error, savedUser);
        });
    } else {
        return done(err, user);
    }
  });
}));

passport.use(new GoogleTokenStrategy({
  clientID: config.googleAuth.clientID,
  clientSecret: config.googleAuth.clientSecret
},
function (accessToken, refreshToken, profile, done) {
  User.findOne({
    'googleProvider.id': profile.id
}, function(err, user) {
    console.log("profile", profile);
    // no user was found, lets create a new one
    if (!user) {
      console.log(profile);
        var newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile._json.picture,
            skills: [],
            address: "undefined",
            role: "undefined",
            password: "undefined",
            googleProvider: {
                id: profile.id,
                token: accessToken
            },
            activated: false
        });

        newUser.save(function(error, savedUser) {
            if (error) {
                console.log(error);
            }
            return done(error, savedUser);
        });
    } else {
        return done(err, user);
    }
});
}));

