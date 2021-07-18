var express = require("express");
var bodyParser = require("body-parser");

// Custom modules
var dbservices = require("./dbservices");
const routes = require('./router');

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
dbservices.initialize(app);