const path = require('path')

module.exports = {
  indexFile: `${path.join(__dirname, '../dist/Rezzi/index.html')}`,

  // Service URLs
  service: {
    get_session: "/get-session",
    get_user_by_email: "/get-user-by-email",
    get_floors: "/get-floors",
  },

  // Firebase constants
  db_keys: {
    users: 'users',
    email: 'email',
    rezzis: 'residence-halls'
  },

  // URLs
  url: {
    sign_in: "/sign-in",
    sign_up: "/sign-up",
    sign_up_hd: "/sign-up-hd",
    home: "/home",
    sign_out: "/sign-out",
    invite_users: "/invite-users",
    join_channel: "/join-channel",
    get_channels: "/get-channels",
  },

  http_status: {
    ok: 200,
    created: 201,
    edited: 202,
    bad_request: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    conflict: 409,
  },

  // Signup codes
  EMAIL_ALREADY_REGISTERED: -500,
  EMAIL_ALREADY_REGISTERED_MSG: 'This email is already registered',
  PASSWORDS_DONT_MATCH: -501,
  PASSWORDS_DONT_MATCH_MSG: 'Passwords don\'t match',
  INVALID_PASSWORD: -504,
  INVALID_PASSWORD_MSG: 'Invalid password pattern: must be at least 8 characters in [A-Za-z0-9]',
  INVALID_EMAIL: -505,
  INVALID_EMAIL_MSG: 'Invalid email pattern: must follow ^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$',

  // Login codes
  sign_in: {
    email_error: 'This is not a registered email',
    password_error: 'Password was incorrect',
  },

  // Rezzi Error codes
  REZZI_DOES_NOT_EXIST: -515,
  REZZI_DOES_NOT_EXIST_MSG: 'The Rezzi you are registered to does not exist, please speak with your RA.',

  // Permission codes
  NOT_RAADMIN: -520,
  NOT_RAADMIN_MSG: 'You are not an RA Admin, you do not have permission to view this',
  NOT_HDADMIN: -530,
  NOT_HDADMIN_MSG: 'You are not an HD Admin, you do not have permission to view this',

  //Invite codes
  USER_ALREADY_EXISTS: -540,
  USER_ALREADY_EXISTS_MSG: 'This user is alreaday a member of your Rezzi',

  // Email codes
  SENDING_EMAIL_ERR: 'Email could not be sent',

  // MISC.
  RESPONSE_NOT_YET_IMPLEMENTED: 'This response type has not yet been implemented.',

}
