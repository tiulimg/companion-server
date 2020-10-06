const mongoose = require('mongoose');

const User = require('../dbModels/User');
const BlackList = require('../dbModels/BlackList');

module.exports = {

  find({username, password}) {
    console.log("BBB UserService");
    return checkIfBlackListed()
    .then(() => {
        console.log("BBB3 UserService");
        return User.findOne({ username: username, password: password })
    })

    function checkIfBlackListed() {
        console.log("BBB1 UserService", black);
        return BlackList.findOne({
          username: username
        }).then(black => {
          console.log("BBB2 UserService", black);
          if (black) throw HttpStatus.UNAUTHORIZED;
        });
      }
  },

  /**
   * @description create a new user if no user exists for the given fbUseId
   */
  async create({
    userId,
    firstname,
    lastname,
  }) {
    let newUser = new User();
    newUser.firstname = firstname;
    newUser.lastname = lastname;

    return newUser.save();
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