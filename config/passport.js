const Promise = require('promise')
const User = require("../api/dbModels/User.js");
const BlackList = require('../api/dbModels/BlackList');
const UserService = require("../api/services/UserService.js");
const JWTService = require('../services/JWTService.js');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	/**
	 * @desc use passports 'JWT' strategy
	 */
	let opts = {
		jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeader(), ExtractJwt.fromUrlQueryParameter("access_token")]),
		secretOrKey: process.env.JWTSecret
	};
	passport.use(new JwtStrategy(opts, function (jwtPayload, done) {

		// Validate user
		return Promise.try(() => {
			if (jwtPayload.sub !== "login")
				throw HttpStatus.UNAUTHORIZED;
		})
			.then(() => User.findById(jwtPayload.user))
			.then(user => {
				if (!user)
					throw HttpStatus.UNAUTHORIZED;

				return BlackList.findOne({ fbId: user.fbUserId })
					.then(black => {
						if (black)
							throw HttpStatus.UNAUTHORIZED;
						user.lastOnlineDate = Date.now();
						return user.save().then(updatedUser => user);
					})
			})
			.then(user => {
				return done(null, { user });
			})
			.catch((err) => {
				if (err instanceof HttpStatus.UNAUTHORIZED)
					return done(err);
				else {
					console.warn('failed to authenticate jwt', err);
					return done(HttpStatus.UNAUTHORIZED);
				}
			});
    }));
    
    passport.use(new LocalStrategy(
        function(username, password, done) {
          UserService.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
              return done(null, false, { message: 'Incorrect password.' });
            }
            user.token = JWTService.createJWT({ user, expireTime: '7d', subject: "login" })
            return done(null, user);
          });
        }
      ));
};