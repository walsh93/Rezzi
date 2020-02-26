const path = require('path')

module.exports = {
  indexFile: `${path.join(__dirname, '../dist/Rezzi/index.html')}`,
  // Service URLs
  service: {
    get_session: "/get-session",
    get_user_by_email: "/get-user-by-email",
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
    create_channel: "/create-channel",
    sign_out: "/sign-out",
    error: {
      page: "/err",
      not_raadmin: "/err/1/unauthorized",
      not_raadmin_ext: "/1/unauthorized",
      not_hdadmin: "/err/0/unauthorized",
      not_hdadmin_ext: "/0/unauthorized",
    },
    join_channel: "/join-channel",
    get_channels: "/get-channels",
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
}
