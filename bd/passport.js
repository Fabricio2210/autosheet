const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = mongoose.model('usuario');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, senha, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Usuário não encontrado' });
        }
        
        bcrypt.compare(senha,user.senha,(err,isMatch)=>{
          if(err) throw err;
          if(isMatch){
            return done(null, user);
          }else{
            return done(null, false, { message: 'Senha incorreta' }); 
          }
        })
      });
    }));
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
};
