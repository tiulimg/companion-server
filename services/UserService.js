const HttpStatus = require('http-status-codes');
var generator = require('generate-password');

const User = require('../dbModels/User');
const BlackList = require('../dbModels/BlackList');
const { registerUser } = require('../graphql/types/user/user.mutations');

function checkIfBlackListed(username) {
    return BlackList.findOne({
      username: username
    }).then(black => {
      if (black) throw HttpStatus.UNAUTHORIZED;
    });
  }

module.exports = {

  loginUser({username, password}) {
    return checkIfBlackListed(username)
    .then(() => {
        return User.findOne({ username: username, password: password })
    })
  },

  /**
   * @description create a new user if no user exists for the given fbUseId
   */
  async registerUser({
    username, 
    password
  }) {
    User.deleteMany({}, callback)
    let newUser = new User();
    newUser.username = username;
    newUser.password = password;

    console.log("newUser, ", newUser);

    return newUser.save();
  },

  resetPassword({username}) {
    return checkIfBlackListed(username)
    .then(() => {
        return User.findById(username).then(user => {
            if (!user) throw ['username', 'no such user'];
      
            var password = generator.generate({
                length: 12,
                numbers: true,
                symbols: true,
            });
            
            if (password !== undefined) {
              user.password = password;
            }
            return user.save();
          });
    })
  },

  /**
   * @description update an existing user
   */
  update({
    userId,
    firstname,
    lastname,
  }) {
    return User.findById(userId).then(user => {
      if (!user) throw ['userId', 'no such user'];

      if (firstname !== undefined) {
        user.firstname = firstname;
      }
      if (lastname !== undefined) user.lastname = lastname;
      return user.save();
    });
  },

  /**
   * @description deletes the given facebook user from the db
   */
  destroy(id) {
    return User.findById(id).then(user => {
      if (!user) throw ['userId', 'user not found'];

      return User.findByIdAndRemove(id);
    });
  },

  findMany({ userIds }) {
    return User.find({
      _id: {
        $in: userIds
      }
    });
  },

};