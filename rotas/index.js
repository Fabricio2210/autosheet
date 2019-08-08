const passport = require('passport');
const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('login',{layout:'mainLogin.handlebars'});
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    badRequestMessage: 'Preencha os campos',
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
