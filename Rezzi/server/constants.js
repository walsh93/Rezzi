const path = require('path')

module.exports = {
  indexFile: `${path.join(__dirname, '../dist/Rezzi/index.html')}`,
  // Service URLs
  service: {
    get_session: "/get-session",
    get_user_by_email: "/get-user-by-email",
    get_floors: "/get-floors",
    get_user: "/get-user",
    channel_messages: "/channel-messages",
  },

  // Firebase constants
  db_keys: {
    users: 'users',
    email: 'email',
    residence_halls: 'residence-halls',
    floors: 'floors',
    hallwide: 'hallwide',
    ra: 'RA',
    channels: 'channels',
    rezzis: 'residence-halls'
  },

  // User types
  account_type: {
    hd: 0,
    ra: 1,
    resident: 2
  },

  // URLs
  url: {
    sign_in: "/sign-in",
    sign_up: "/sign-up",
    sign_up_hd: "/sign-up-hd",
    home: "/home",
    user_url: "/get-user",
    edit_profile: "/edit-profile",
    create_channel: "/create-channel",
    sign_out: "/sign-out",
    invite_users: "/invite-users",
    error: {
      page: "/err",
      not_raadmin: "/err/1/unauthorized",
      not_raadmin_ext: "/1/unauthorized",
      not_hdadmin: "/err/0/unauthorized",
      not_hdadmin_ext: "/0/unauthorized",
    },
    join_channel: "/join-channel",
    get_channels: "/get-channels",
    pword_reset_request: "/pword-reset-request",
    pword_reset_sent: "/pword-reset-sent",
    pword_reset_change: "/pword-reset-change",
    create_rezzi: "/create-rezzi",
    dashboard: "/dashboard",
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
    error: 500,
  },

  // Error messages (can use generic HTTP codes)
  error: {
    sign_in: {
      email_error: 'This is not a registered email',
      password_error: 'Password was incorrect',
    },
    sign_up: {
      email_already_registered: 'This email is already registered',
      email_invalid: 'Invalid email pattern: must follow ^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$',
      password_mismatch: 'Passwords don\'t match',
      password_invalid: 'Invalid password pattern: must be at least 8 characters in [A-Za-z0-9]',
    },

    // MISC.
    sending_email_error: 'Email could not be sent',
    rezzi_not_exist: 'The Rezzi you are registered to does not exist, please speak with your RA.',
    response_not_implemented: 'This response type has not yet been implemented.',
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

  // Email codes
  SENDING_EMAIL_ERR: 'Email could not be sent',

  //Password Reset Codes
  EMAIL_NOT_REGISTERED: 'Email does not belong to a Rezzi account',

  // MISC.
  RESPONSE_NOT_YET_IMPLEMENTED: 'This response type has not yet been implemented.',

  // Socket events
  socket: {
    connection: 'connection',
    new_channel_view: 'new-channel-view',
    new_message: 'new-message',
    new_message_added: 'added-new-message',
    new_private_view: 'new-private-view', //$$$conley
    new_private_messsage: 'new-private-message', //$$$conley
    new_private_message_added: 'added-new-private-message', //$$$conley
  }
}
