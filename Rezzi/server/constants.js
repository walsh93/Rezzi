module.exports = {
    // Pages
    signinPage: "/sign-in",
    signupPage: "/sign-up",
    signupHDPage: "/sign-up-hd",
    homePage: "/home",

    // ALL CODES
    // HTTP status codes
    HTTP_OK: 200,
    HTTP_CREATED: 201,
    HTTP_EDITED: 202,
    HTTP_BAD_REQUEST: 400,
    HTTP_UNAUTHORIZED: 401,
    HTTP_FORBIDDEN: 403,
    HTTP_NOT_FOUND: 404,
    HTTP_CONFLICT: 409,

    // Custom web app codes
    ERROR_GETTING_DOCUMENT: -600,
    ENTRY_EXISTS: -601,
    ENTRY_DOESNT_EXIST: -602,

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
    EMAIL_NOT_REGISTERED: -502,
    EMAIL_NOT_REGISTERED_MSG: 'This is not a registered email',
    INCORRECT_PASSWORD: -503,
    INCORRECT_PASSWORD_MSG: 'Password was incorrect',

    // Rezzi Error codes
    REZZI_DOES_NOT_EXIST: -515,
    REZZI_DOES_NOT_EXIST_MSG: 'The Rezzi you are registered to does not exist, please speak with your RA.',

    // Permission codes
    NOT_RAADMIN: -520,
    NOT_RAADMIN_MSG: 'You are not an RA Admin, you do not have permission to view this',
    NOT_HDADMIN: -530,
    NOT_HDADMIN_MSG: 'You are not an HD Admin, you do not have permission to view this',

    // Email codes
    SENDING_EMAIL_ERR: 'Email could not be sent',

    // MISC.
    RESPONSE_NOT_YET_IMPLEMENTED: 'This response type has not yet been implemented.',

  }
