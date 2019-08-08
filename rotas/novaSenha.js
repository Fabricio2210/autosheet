const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const generator = require('generate-password');
const nodemailer = require('nodemailer');

require('../bd/usuarios');
const User = mongoose.model('usuario');

router.get("/novasenha",(req,res)=>{
    res.render('novasenha')
});

router.put('/novasenha',(req,res)=>{
  let senha = generator.generate({
    length: 6,
    numbers: true
  });
    let erro = [];
    if (!req.body.email) {
      erro.push({ text: 'Preencha o campo email' });
    }
    if (erro.length > 0) {
      res.render('novasenha', {
        erro: erro
      });
    } else{
      User.findOne({email:req.body.email})
      .then((usuario)=>{
          if(!usuario){
            req.flash('erro_msg', 'Email não cadastrado');
            res.redirect('/novasenha');
            
          }else{
            usuario.senha =senha;
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(usuario.senha, salt, (err, hash) => {
                  if (err) throw err;
                  usuario.senha = hash;;

              const email = `<h3>Sua nova senha</h3>
        <h3>${senha}</h3>
        <p>Se deseja redefinir sua senha clique no link abaixo:</p>
        <h3><a href="seu servirdor aqui/">Nova senha</a>`;

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
          subject: 'Nova senha',
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
          
                  usuario
                    .save()
                    .then(() => {
                      res.redirect('/');
                      req.flash('sucesso_msg', 'Senha foi enviada para o seu email');
                      console.log(req.flash('sucesso_msg'));
                    })
                    .catch(err => {
                      console.log(err);
                      return;
                    });
                  });
                });
          }
      })  
    }
    
});


module.exports = router;