// const { schema: userSchema, query : userQuery } = require("./types/user/user.schema");
// const { schema: picAccessSchema, query: picAccessQuery} = require('./types/pictureAccess/pictureAccess.schema.js');
// const { schema: eventSchema, query: eventQuery } = require('./types/event/event.schema.js');
// const { schema: chatSchema, query: chatQuery } = require('./types/chat/chat.schema.js');
// const { schema: notifSchema, query: notifQuery } = require('./types/notification/notification.schema.js');
// const { schema: constantSchema, query: constantQuery } = require('./types/constantsStore/constantsStore.schema.js');
const { merge } = require('lodash');

const querySchema = [`
	# The root query contains all the queryable data
	type Query {
		hello: String
	}
`]

const queryResolvers = {
	Query: {
        hello: () => {
            return 'Hello world!';
        },
	}
}

//const schema = [...querySchema, ...userSchema, ...picAccessSchema, ...eventSchema, ...constantSchema, ...chatSchema, ...notifSchema];
//const resolvers = merge(queryResolvers, userQuery.resolvers, picAccessQuery.resolvers, eventQuery.resolvers, constantQuery.resolvers, chatQuery.resolvers, notifQuery.resolvers);
const schema = [...querySchema];
const resolvers = merge(queryResolvers);

module.exports = {
	schema,
	resolvers
}