const passport = require('passport');
const HttpStatus = require('http-status-codes');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLError } = require('graphql');
const router = require('express').Router();
const schema = require('../graphql/schema');

const jwt = require('jsonwebtoken');
const assert = require('assert');
const cors = require('cors');

require('../config/passport')(passport) // as strategy in ./passport.js needs passport object

router.post(
  '/graphql',
  cors({
    optionsSuccessStatus: 200
  }),
  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, parsedJWT, info) => {
      if (err) {
        logger.error(err);
        return res.json(HttpStatus.UNAUTHORIZED, { errors: [err] });
      }

      if (
        !parsedJWT &&
        (info instanceof jwt.JsonWebTokenError)
      ) {
        const errors = [Object.assign({ status: 401 }, info)];
        return res.json(HttpStatus.UNAUTHORIZED, { errors: errors });
      }
      if (parsedJWT) {
        req.user = parsedJWT.user;
        req.isAuthenticated = () => true;
      }

      return next();
    })(req, res, next);
  },
  graphqlHTTP((req, res) => {
    return {
      schema,
      graphiql: true,
      context: {
        req,
        res
      },
      validationRules: [
        validationContext => {
          if (req.isAuthenticated()) return true;
          else return makeSureOnlyLoginIsExecuted(validationContext, res);
        }
      ]
    };
  })
);

/**
 * checks if the gql query only contains the loginUser mutation
 * @param {*} validationContext
 */
function makeSureOnlyLoginIsExecuted(validationContext) {
  let documentAst = validationContext._ast;
  try {
    assert(
      documentAst.definitions.length === 1,
      ' executed more than just a mutation'
    );
    assert(
      documentAst.definitions[0].operation === 'mutation',
      ' not executing a mutation'
    );

    let mutations = documentAst.definitions[0].selectionSet.selections || [];
    assert(mutations.length === 1, ' not executing only loginUser ');
    assert(
      mutations[0].name.value === 'userMutations',
      ' not executing loginUser '
    );

    let userMutations = mutations[0].selectionSet.selections || [];
    assert(userMutations.length <= 2, ' not executing only loginUser');

    if (userMutations.length === 2) {
      if (userMutations[0].name.value === 'loginUser')
        assert(
          userMutations[1].name.value === '__typename',
          'not executing loginUser'
        );
      else {
        assert(
          userMutations[0].name.value === '__typename',
          'not executing loginUser'
        );
        assert(
          userMutations[1].name.value === 'loginUser',
          'not executing loginUser'
        );
      }
    } else
      assert(
        userMutations[0].name.value === 'loginUser',
        'not executing loginUser'
      );

    return true;
  } catch (err) {
    let error = new GraphQLError(
      'UNAUTHORIZED - user must login, the request ' + err.message,
      undefined,
      undefined,
      undefined,
      undefined,
      HttpStatus.UNAUTHORIZED
    );
    validationContext.reportError(error);
    return false;
  }
}

module.exports = router;
