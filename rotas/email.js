const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const mongoXlsx = require('mongo-xlsx');
const moment = require('moment');
const methodOverride = require('method-override');
const router = require('express').Router();
const { ensureAuthenticated } = require('../bd/auth');

require('../bd/usuarios');
const User = mongoose.model('usuario');

require('../bd/model');
const Model = mongoose.model('modelo');

require('../bd/email');
const Email = mongoose.model('email');

router.use(methodOverride('_method'));

router.get('/email/:id', ensureAuthenticated, (req, res) => {
  Email.findOne({ usuario: req.params.id }).then(dashboardUsuario => {
    if (req.user._id != req.params.id) {
      req.flash('erro_msg', 'Não autorizado');
      res.redirect('/');
    } else {
      res.render('email', {
        dashboardUsuario: dashboardUsuario
      });
    }
  });
});

router.post('/email/:id', ensureAuthenticated, (req, res) => {
  let erro = [];
  if (!req.body.destinatario) {
    erro.push({ text: 'Preencha o destinatario' });
  }
  if (!req.body.body) {
    erro.push({ text: 'Preencha o corpo do email' });
  }
  if (!req.body.remetente) {
    erro.push({ text: 'Preencha o campo remetente' });
  }
  if (erro.length > 0) {
    res.render('email', {
      erro: erro
    });
  } else {
    Model.findOne({ usuario: req.user.id })
      .populate('modelo')
      .then(data => {
        const email = new Email({
          destinatario: req.body.destinatario,
          remetente: req.body.remetente,
          email: req.body.body,
          usuarioNome: req.user.nome,
          usuario: req.user._id
        });

        email.save().then((rec) => {
          req.flash('sucesso_msg', 'Email criado com sucesso')
          res.redirect('/dashboard');
        });
      });
  }
});

router.put('/email/:id', ensureAuthenticated, (req, res) => {
  Email.findOne({ usuario: req.params.id }).then(dashboardUsuario => {
    let ferias;
    if (req.body.ferias) {
      ferias = true;
    } else {
      ferias = false;
    }

    dashboardUsuario.destinatario = req.body.destinatario;
    dashboardUsuario.remetente = req.body.remetente;
    dashboardUsuario.destinatario = req.body.destinatario;
    dashboardUsuario.comeco = req.body.comeco;
    dashboardUsuario.fim= req.body.fim;
    dashboardUsuario.email = req.body.body;
    dashboardUsuario.ferias = ferias;

    dashboardUsuario.save().then(() => {
      req.flash('sucesso_msg', 'Email editado com sucesso')
      res.redirect('/dashboard');
    });
  });
});

router.delete('/email/:id', (req, res) => {
  Email.deleteOne({ usuario: req.user.id }).then(() => {
    req.flash('sucesso_msg', 'Email deletado com sucesso')
    res.redirect('/dashboard');
  });
});
module.exports = router;
