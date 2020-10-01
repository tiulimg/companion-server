const router = require('express').Router();
const graphql = require('./graphql');

router.use('/', graphql);

module.exports = router;
