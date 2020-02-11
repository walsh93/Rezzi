
/**
 * Check that the user is logged out
 *
 * Check the __session. If the 'user' property is set, that means that the user is logged
 * in, and thus needs to be redirected appropriately. This should only be called when trying to access
 * the Signup page or the Login page, and if needed, redirect to the home page.
 *
 * @param {Request<Dictionary<string>>} request Request that contains the session
 * @param {Response} response HTTP response
 * @param {*} next Function that passes handling to next handler
 */
module.exports.userNeedsToBeLoggedOut = function userNeedsToBeLoggedOut(request, response, next) {
  console.log('userNeedsToBeLoggedOut', request.__session)
  if (request.__session.email) {
    response.redirect('/home')
  } else {
    next()  // Propogate to the next handler
  }
}

/**
 * Check that the user is logged in
 *
 * Check the __session. If the 'user' property is not set, that means that the user is not
 * logged in, and thus needs to be redirected appropriately. This should be called when trying to
 * access a page that is not the Signup or Login page, and if needed, redirect to the Login page.
 *
 * @param {Request<Dictionary<string>>} request Request that contains the session
 * @param {Response} response HTTP response
 * @param {*} next Function that passes handling to next handler
 */
module.exports.userNeedsToBeLoggedIn = function userNeedsToBeLoggedIn(request, response, next) {
  console.log('userNeedsToBeLoggedIn', request.__session)
  if (!request.__session.email) {
    response.redirect('/sign-in')
  } else {
    next()  // Propogate to the next handler
  }
}
