var express = require("express");
var bodyParser = require("body-parser");

// Custom modules
var dbservices = require("./services/dbservices");
const routes = require('./controllers/index');

// Construct a schema, using GraphQL schema language

// var schema_text = require('./graphql/schema');
// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   hello: () => {
//     return 'Hello world!';
//   },
// };

// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
//   }));

var app = express();
app.use(bodyParser.json());
app.use((err, req, res, next) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.sendStatus(400); // Bad request
    }

    next();
});

app.use(routes);

// Connect to the database before starting the application server.
dbservices.initialize(app)
.catch(rejection => {
    logservices.logRejection(rejection);
});