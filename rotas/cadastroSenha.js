const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = require('express').Router();

require('../bd/usuarios');
const User = mongoose.model('usuario');

router.get('/cadastroSenha',(req,res)=>{
    res.render('cadastroSenha')
});

router.put('/cadastroSenha',(req,res)=>{
    let erro = [];
    if (!req.body.senha) {
      erro.push({ text: 'Preencha o campo senha' });
    }
    if(!req.body.novaSenha){
        erro.push({text:'Preencha o campo nova senha'})
    }
    if (erro.length > 0) {
      res.render('cadastroSenha', {
        erro: erro
      });
         
    }else{
      User.findOne({email:req.body.email})
      .then((usuario)=>{
        let senha = req.body.senha
        bcrypt.compare(senha,usuario.senha,(err,correto)=>{
          if(err){
            req.flash('erro_msg', 'senha não encontrada');
            console.log(usuario);
            res.redirect('/cadastroSenha');
          };
          if(correto){
            usuario.senha = req.body.novaSenha;
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(usuario.senha, salt, (err, hash) => {
                  if (err) throw err;
                  usuario.senha = hash;
      
                  usuario
                    .save()
                    .then(() => {
                      res.redirect('/');
                      req.flash('sucesso_msg', 'Senha salva com sucesso');
                     
                    })
                    .catch(err => {
                      console.log(err);
                      return;
                    });
                });
              });
          };
        });
         
      });      
    } 
});


module.exports = router;