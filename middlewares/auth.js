// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  req.flash("error", "You need to log in first.");
  res.redirect(`${req.baseUrl}/login`);
}

function isNotAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect(req.baseUrl||"/");
  }
  next();
}
export {isAuthenticated,isNotAuthenticated}