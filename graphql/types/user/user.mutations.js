const JWTService = require('../../../services/JWTService.js');
const Promise = require('promise');

module.exports = {
	/**
	 * Create JWT for logged-in user
	 */
	loginUser: (source, args, {UserService, req, res}) => {
		return new Promise((res, rej) => {
            console.log("AAA user.mutations.js");
            return UserService.find({ username: args.username, password: args.password })
                .then(user => {
                    console.log("CCC user.mutations.js ", user);
                    if (user === undefined)
                        rej("Username or password are incorrect")
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