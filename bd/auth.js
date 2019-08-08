module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('erro_msg', 'Não autorizado');
    res.redirect('/');
  }
};
