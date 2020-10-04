const { schema: userSchema, mutation: userMutations } = require("./types/user/user.schema");
const { merge } = require('lodash');

const MutationSchema = [`
	# The root mutation contains all the acceptable methods to execute
	type Mutation {
		userMutations: UserMutations
	}
`]

const MutationResolvers = {
	Mutation: {
		userMutations: () => ({}),
	}
}

const schema = [...MutationSchema, ...userSchema];

const resolvers = merge(MutationResolvers, userMutations.resolvers);

module.exports = {
	schema,
	resolvers
}