const JWTService = require('../../../services/JWTService.js');
const Promise = require('promise');

module.exports = {
	/**
	 * Create JWT for logged-in user
	 */
	loginUser: (source, args, {UserService, req, response}) => {
		return new Promise((res, rej) => {
            return UserService.loginUser({ username: args.username, password: args.password })
                .then(user => {
                    if (user === undefined || user == null)
                        response.status(401).send({
                            message: 'Username or password are incorrect'
                        });
                    else
                        res({
                            isNewUser: false,
                            loginToken: JWTService.createJWT({ user, expireTime: '7d', subject: "login"}),
                            loggedInUser: user
                        });
                })
		})
    },
    
    registerUser: (source, args, {UserService, req, response}) => {
		return new Promise((res, rej) => {
            return UserService.registerUser({ username: args.username, password: args.password })
                .then(user => {
                    if (user === undefined || user == null)
                        response.status(500).send({
                            message: "Couldn't create user"
                        });
                    else
                        res({
                            isNewUser: true,
                            loginToken: JWTService.createJWT({ user, expireTime: '7d', subject: "login"}),
                            loggedInUser: user
                        });
                })
                .catch(err => {
                    response.status(500).send({
                        message: err
                    });
                })
		})
    },
    
    resetPassword: (source, args, {UserService, req, response}) => {
		return new Promise((res, rej) => {
            return UserService.resetPassword({ username: args.username })
                .then(user => {
                    if (user === undefined || user == null)
                        response.status(500).send({
                            message: "Couldn't reset password"
                        });
                    else
                        res({
                            isNewUser: false,
                        });
                })
                .catch(err => {
                    response.status(500).send({
                        message: err
                    });
                })
		})
	},
}