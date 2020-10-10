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

    isUsernameInUse: (source, args, {UserService, req, response}) => {
		return new Promise((res, rej) => {
            return UserService.isUsernameInUse({ username: args.username })
                .then(userexists => {
                    res(userexists);
                })
                .catch(err => {
                    console.log("Err: ", err);
                    response.status(500).send({
                        message: err
                    });
                })
		})
    },
    
    registerUser: (source, args, {UserService, req, response}) => {
		return new Promise((res, rej) => {
            return UserService.registerUser({ username: args.username, password: args.password })
                .then(user => {
                    if (user === undefined || user == null) {
                        console.log("Err: user is undefined");
                        response.status(500).send({
                            message: "Couldn't create user"
                        });
                    }
                    else
                        res({
                            isNewUser: true,
                            loginToken: JWTService.createJWT({ user, expireTime: '7d', subject: "login"}),
                            loggedInUser: user
                        });
                })
                .catch(err => {
                    console.log("Err: ", err);
                    if (err.code == "11000") {
                        response.status(500).send({
                            message: "Username is in use"
                        });
                    }
                    else {
                        response.status(500).send({
                            message: err
                        });
                    }
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
                        res(true);
                })
                .catch(err => {
                    response.status(500).send({
                        message: err
                    });
                })
		})
	},
}