const JWTService = require('../../../services/JWTService.js');
const Promise = require('promise');

module.exports = {
	/**
	 * Create JWT for logged-in user
	 */
	loginUser: (source, args, {UserService, req, res}) => {
		return new Promise((res, rej) => {
            return UserService.find({ username: req.param['username'], password: req.param['password'] })
                .then(user => {
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