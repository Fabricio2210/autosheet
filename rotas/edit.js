const fs = require('fs');
const mongoose = require('mongoose');
const router = require('express').Router();
const { ensureAuthenticated } = require('../bd/auth');

require('../bd/usuarios');
const User = mongoose.model('usuario');

require('../bd/model');
const Model = mongoose.model('modelo');

require('../bd/email');
const Email = mongoose.model('email');

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  User.findOne({ _id: req.params.id }).then(dashboardUsuario => {
    if (req.user._id != req.params.id) {
      req.flash('erro_msg', 'Não autorizado');
      res.redirect('/');
    } else {
      res.render('edit', {
        dashboardUsuario: dashboardUsuario,
        data: `uploads/file-${req.user.id}.xlsx`
      });
    }
  });
});

router.put('/edit/:id', (req, res) => {
  User.findOne({ _id: req.params.id }).then(dashboardUsuario => {
    let plantonista;
    if (req.body.plantonista) {
      plantonista = true;
    } else {
      plantonista = false;
    }
    dashboardUsuario.nome = req.body.nome;
    dashboardUsuario.email = req.body.email;
    dashboardUsuario.plantonista = plantonista;
    dashboardUsuario.save().then(() => {
      req.flash('sucesso_msg', 'Perfil editado com sucesso')
      res.redirect('/dashboard');
    });
  });
});

router.delete('/edit/:id', (req, res) => {
  User.deleteOne({ _id: req.user.id }).then(() => {
    Model.deleteOne({ usuario: req.user.id }).then(() => {
      Email.deleteOne({ usuario: req.user.id }).then(() => {
        fs.unlink(`./public/uploads/file-${req.user.id}.xlsx`, () => {});
        res.redirect('/dashboard');
      });
    });
  });
});

module.exports = router;
