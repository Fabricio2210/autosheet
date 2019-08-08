const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../bd/auth');
const router = require('express').Router();

require('../bd/usuarios');
const User = mongoose.model('usuario');

router.get('/slider', ensureAuthenticated, (req, res) => {
  User.find({ user: req.usuario })
    .sort({ data: 'desc' })
    .then(usuario => {
      res.render('slider', {
        usuario: usuario
      });
    });
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('sucesso_msg', 'Deslogado');
  res.redirect('/');
});

router.get('/sobre', (req, res) => {
  res.render('about');
});

module.exports = router;
