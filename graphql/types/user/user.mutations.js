const JWTService = require('../../../services/JWTService.js');
const Promise = require('promise');

module.exports = {
	/**
	 * Create JWT for logged-in user
	 */
	loginUser: (source, args, {UserService, req, response}) => {
		return new Promise((res, rej) => {
            return UserService.find({ username: args.username, password: args.password })
                .then(user => {
                    if (user === undefined || user == null)
                        res("Username or password are incorrect")
                    else
                        res({
                            isNewUser: false,
                            loginToken: JWTService.createJWT({ user, expireTime: '7d', subject: "login"}),
                            loggedInUser: user
                        });
                })
		})
	},
}