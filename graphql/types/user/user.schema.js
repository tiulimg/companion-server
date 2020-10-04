const { merge } = require('lodash');
const JWTService = require('../../../services/JWTService.js');

const user_mutations = require("./user.mutations.js");


const fs = require('fs');
const userSchema = fs.readFileSync(__dirname + '/user.gql', 'utf8')

let createUserSchema = '';

createUserSchema = `
    extend type UserMutations {
        createUser(
            firstname: String,
            lastname: String,
        ): LoggedInDetails
    }
`;

user_mutations.createUser = (root, args, { UserService }) => {
    return UserService.create(args)
        .then(user => {
            return {
                isNewUser: true,
                loginToken: JWTService.createJWT({ user, expireTime: '7d', subject: "login"}),
                loggedInUser: user
            }
        })
}

const schema = [userSchema, createUserSchema]
const query = {
	resolvers: {
		Query: {
			findUser: (root, { id }, { UserService, ChatService, req }) => {
				return UserService.findMatchingUser(req.user, id, ChatService);
			},
			me: (root, { id }, { req }) => {
				return req.user;
			},
		},
		User: {
			userId: (root) => {
				return root.id;
			},
			firstname: (root) => {
                return root.firstname;
			},
		},
	}
};

const mutation = {
	resolvers: {
		UserMutations: user_mutations
	}
}

module.exports = {
	schema: [...schema],
	query: {
		resolvers: merge(query.resolvers)
	},
	mutation: {
		resolvers: merge(mutation.resolvers)
	}
}
