var passport = require('passport'); // import module passport từ thư viện passport
var LocalStrategy = require('passport-local').Strategy; 
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');
var User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 3600 });
};


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

// exports.jwtPassport = passport.use(new JwtStrategy(opts,
//     (jwt_payload, done) => {
//         console.log("JWT payload: ", jwt_payload);
//         User.findOne({ _id: jwt_payload._id }, (err, user) => {
//             if (err) {
//                 return done(err, false);
//             }
//             else if (user) {
//                 return done(null, user);
//             }
//             else {
//                 return done(null, false);
//             }
//         });
//     }));

// Function to verify if the user is an admin
exports.verifyAdmin = (req, res, next) => {
  // Check if the user is an admin
  if (req.user && req.user.admin) {
    // If the user is an admin, call next() to proceed with the next middleware
    next();
  } else {
    // If the user is not an admin, return an error with status 403
    const err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  }
};

    exports.jwtPassport = passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
          User.findOne({ _id: jwt_payload._id })
            .then((user) => {
              if (user) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            })
            .catch((error) => {
              return done(error, false);
            });
        })
      );

exports.verifyUser = passport.authenticate('jwt', { session: false });