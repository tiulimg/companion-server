"use strict";
const jwt = require('jsonwebtoken'),
Promise = require('promise');

/**
 * JWT Service - handle creation/validation of Json Web Tokens
 */
module.exports = {
	createJWT: function({user, userId, jwtid, expireTime, subject}) {
        console.log("user, ", user);
        console.log("userId, ", userId);
        console.log("jwtid, ", jwtid);

		let id = user ? user.id : userId;
		let payload = {};

		if (id)
			payload.user = id;

		let options = {
			expiresIn: expireTime,
			subject: subject,
			jwtid: jwtid
		};

		let token = jwt.sign(payload, process.env.JWTSecret, options);
		return token;
	},

	verifyJWT: function({token, subject}) {
		console.log(token);
		console.log(process.env.JWTSecret);
		console.log(subject);
		return Promise.try(() => {
			let payload = jwt.verify(token, process.env.JWTSecret, { subject: subject });

			return payload;
		}).catch(jwt.JsonWebTokenError, err => {
			loggger.error(err);
			throw HttpStatus.UNAUTHORIZED;
		}).catch(jwt.TokenExpiredError, err => {
			throw HttpStatus.UNAUTHORIZED;
		})
	}
}
