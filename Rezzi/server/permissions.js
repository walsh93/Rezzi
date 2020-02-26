const http = require('./constants').http_status
const url = require('./constants').url
const account_type = require('./constants').account_type

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
module.exports.userNeedsToBeLoggedOut = function untblo(request, response, next) {
  console.log('userNeedsToBeLoggedOut', request.__session)
  if (request.__session.email) {
    response.redirect(url.home)
  } else {
    next()  // Propogate to the next handler
  }
}

/**
 * Check that the user is logged in and verified
 *
 * Check the __session. If the 'email' property is not set, that means that the user is not
 * logged in, and thus needs to be redirected appropriately. If the email is not verified, this
 * user must still create a profile on the sign-up page. This should be called when trying to
 * access a page within the app (pages accessible from/beyond the home page).
 *
 * @param {Request<Dictionary<string>>} request Request that contains the session
 * @param {Response} response HTTP response
 * @param {*} next Function that passes handling to next handler
 */
module.exports.userNeedsToBeLoggedInAndVerified = function untbliav(request, response, next) {
  console.log('userNeedsToBeLoggedIn', request.__session)
  if (!request.__session.email) {  // not signed in
    response.redirect(url.sign_in)
  } else if (!request.__session.verified) {  // signed-in but not verified
    response.redirect(url.sign_up)
  } else {
    next()  // Propogate to the next handler
  }
}

/**
 * Check that the user is logged in and not verified. These specific conditions only need to hold
 * when routing to the sign-up page.
 *
 * @param {Request<Dictionary<string>>} request Request that contains the session
 * @param {Response} response HTTP response
 * @param {*} next Function that passes handling to next handler
 */
module.exports.userNeedsToBeLoggedInAndUnverified = function untbliau(request, response, next) {
  console.log('userNeedsToBeLoggedIn', request.__session)
  if (!request.__session.email) {  // not signed in
    response.redirect(url.sign_in)
  } else if (request.__session.verified) {  // signed-in and verified
    response.redirect(url.home)
  } else {
    next()  // Propogate to the next handler
  }
}

/**
 * Check that the user is a logged in RA
 *
 * Check the __session. If the 'email' property is not set, that means that the user is not
 * logged in, and thus needs to be redirected appropriately. If the email is not verified, this
 * user must still create a profile on the sign-up page. This should be called when trying to
 * access a page within the app (pages accessible from/beyond the home page).
 *
 * @param {Request<Dictionary<string>>} request Request that contains the session
 * @param {Response} response HTTP response
 * @param {*} next Function that passes handling to next handler
 */
module.exports.userNeedsToBeLoggedInRA = function untblia(request, response, next) {
  console.log('userNeedsToBeLoggedIn', request.__session)
  if (!request.__session.email) {  // not signed in
    response.redirect(url.sign_in)
  } else if (request.__session.accountType != account_type.ra) {  // signed-in but not admin
    response.redirect(url.error.not_raadmin)
  } else {
    next()  // Propogate to the next handler
  }
}

/**
 * Check that user is logged in, verified and a HD. This condition is needed for inviting users.
 *
 * Check that the user is logged in and verified
 *
 * Check the __session. If the 'email' property is not set, that means that the user is not
 * logged in, and thus needs to be redirected appropriately. If the email is not verified, this
 * user must still create a profile on the sign-up page. This should be called when trying to
 * access a page within the app (pages accessible from/beyond the home page).
 *
 * @param {Request<Dictionary<string>>} request Request that contains the session
 * @param {Response} response HTTP response
 * @param {*} next Function that passes handling to next handler
 */
module.exports.userNeedsToBeLoggedInHD = function untblihd(request, response, next) {
  console.log('userNeedsToBeLoggedInHD', request.__session)
  if (!request.__session.email) {  // not signed in
    response.redirect('/sign-in')
  } else if (request.__session.accountType != account_type.hd) {
    response.redirect('/err/0/unauthorized') //doesn't have HD access
  } else {
    next() //Propogate to next handler
  }
}

/**
 *
 * Check that the user is logged in and verified and has a temp password
 *
 * Check the __session. If the 'email' property is not set, that means that the user is not
 * logged in, and thus needs to be redirected appropriately. If the email is not verified, this
 * user must still create a profile on the sign-up page. This should be called when trying to
 * access a page within the app (pages accessible from/beyond the home page).
 *
 * @param {Request<Dictionary<string>>} request Request that contains the session
 * @param {Response} response HTTP response
 * @param {*} next Function that passes handling to next handler
 */
module.exports.userNeedsToBeLoggedInAndVerifiedAndTempPword = function untbliav(request, response, next) {
  console.log('userNeedsToBeLoggedInAndTempPword', request.__session)
  if (!request.__session.email) {  // not signed in
    response.redirect(url.sign_in)
  } else if (!request.__session.verified) {  // signed-in but not verified
    response.redirect(url.sign_up)
  } else if(!request.__session.tempPword){
    response.redirect(url.home)
  }else {
    next()  // Propogate to the next handler
  }
}
