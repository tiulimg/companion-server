const { schema: queryRootSchema, resolvers: queryRootResolvers } = require("./query.schema");
//const { schema: mutationRootSchema, resolvers: mutationRootResolvers } = require("./mutation.schema");
//const { schema: subscriptionsRootSchema, resolvers: subscriptionsRootResolvers } = require("./subscription.schema");
//const { schema: scalarsSchema, resolvers: scalarsResolvers} = require('./scalars/scalars.schema.js');
//const enums_schema = require('./enums/enums.schema.js');
const { merge } = require('lodash');
const { makeExecutableSchema  } = require('graphql-tools')

// const rootSchema = `
// 	schema {
// 		query: Query,
// 		mutation: Mutation,
// 		subscription: Subscription
// 	}
// `

const rootSchema = `
	schema {
		query: Query,
	}
`


//const schema = [rootSchema, ...enums_schema, ...queryRootSchema, ...mutationRootSchema, ...subscriptionsRootSchema, ...scalarsSchema];
const schema = [rootSchema, ...queryRootSchema];
//const resolvers = merge(queryRootResolvers, mutationRootResolvers, subscriptionsRootResolvers, scalarsResolvers);
const resolvers = merge(queryRootResolvers);

const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers
})

// addMockFunctionsToSchema({
// 	schema: executableSchema
// })

module.exports = executableSchema;