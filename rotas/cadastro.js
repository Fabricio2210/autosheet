const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const nodemailer = require('nodemailer');

require('../bd/usuarios');
const User = mongoose.model('usuario');

router.get('/cadastro', (req, res) => {
  res.render('card');
});

router.post('/cadastro', (req, res) => {
  let erro = [];
  if (!req.body.nome) {
    erro.push({ text: 'Preencha o campo nome' });
  }
  if (!req.body.email) {
    erro.push({ text: 'Preencha o campo email' });
  }
  if (!req.body.senha) {
    erro.push({ text: 'Preencha o campo senha' });
  }
  if (erro.length > 0) {
    res.render('card', {
      erro: erro
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('erro_msg', 'Email já cadastrado');
        res.redirect('/cadastro');
      } else {
        let desenvolvedor;

        if (req.body.desenvolvedor) {
          desenvolvedor = true;
        } else {
          desenvolvedor = false;
        }
        let plantonista;

        if (req.body.plantonista) {
          plantonista = true;
        } else {
          plantonista = false;
        }

        const novoUsuario = new User({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha,
          desenvolvedor: desenvolvedor,
          plantonista: plantonista
        });
        const email = `<h3>Sua senha e usuário</h3>
        <h3>${req.body.email}</h3>
        <h3>${req.body.senha}</h3>
        <h3><a href="seu servidor aqui/">Login</a>`;

        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'seu email aqui',
            pass: 'sua senha aqui'
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        let testemails = [`${req.body.email}`];

        let mailOptions = {
          from: '"Autosheet" <seu email aqui>',
          to: testemails,
          subject: 'Login sistema teste Cadastro',
          text: 'Hello world?',
          html: email
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
            if (err) throw err;
            novoUsuario.senha = hash;

            novoUsuario
              .save()
              .then(() => {
                req.flash('sucesso_msg', 'Cadastrado realizado com sucesso');
                res.redirect('/'); 
                console.log(req.flash('sucesso_msg'));
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

module.exports = router;
