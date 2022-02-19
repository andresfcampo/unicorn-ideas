function isLoggedIn(req, res, next) {
    if (!req.session.currentUser) {
      res.redirect("/user/login");
    } else {
      next();
    }
  }
  
  function isLoggedOut(req, res, next) {}
  
module.exports = { isLoggedIn, isLoggedOut };