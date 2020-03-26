const bcrypt = require('bcrypt');


class Passwords {
    generateHash(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
    }

    validPassword(password, hashed_password) {
      return bcrypt.compareSync(password, hashed_password);
    }
/*
    setNewPass(session) {

    }
*/
}

module.exports = Passwords;
