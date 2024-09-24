const isAuthenticated = (req, res, next) => {
    // Check if the user is authenticated
    if (req.session && req.session.userId) {
      // User is authenticated, allow them to proceed
      return next();
    } else {
      // User is not authenticated, redirect them to the sign-in page
      return res.redirect('/signin');
    }
  };
  
  module.exports = 
  {isAuthenticated};