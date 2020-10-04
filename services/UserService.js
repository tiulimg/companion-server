const User = require('../dbModels/User');
const BlackList = require('../dbModels/BlackList');
const UnauthorizedError = require('../errors/UnauthorizedError.js');

module.exports = {

  /**
   * @description try to find if there exists a user to the fb profile, if not - create one
   * @param {*} fbProfile
   */
  findOrCreate(fbProfile, accessToken) {

    return (
        checkIfBlackListed()
        .then(() => User.findOne({ userId: fbProfile.id }))
        .then(user => {
          if (user) {
            return user.save();
          } else return createUser();
        })
    );

    function checkIfBlackListed() {
      return BlackList.findOne({
        fbId: fbProfile.id
      }).then(black => {
        if (black) throw HttpStatus.UNAUTHORIZED;
      });
    }

    async function createUser() {
      let newUser = new User();
      newUser.userId = fbProfile.id;
      newUser.firstname = fbProfile.name.givenName;
      newUser.lastname = fbProfile.name.familyName;

      return newUser.save().then(user => {
        user.isNew = true;
        return user;
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