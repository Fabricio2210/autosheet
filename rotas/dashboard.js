const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const mongoXlsx = require('mongo-xlsx');
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

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + req.user.nome + path.extname('./public/uploads/modelo.xlsx')
    );
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 6000000 },
  fileFilter: function(req, file, cb) {
    if (path.extname(file.originalname) !== '.xlsx') {
      req.flash('erro_msg', 'Somente arquivos xlsx');
      return cb(null, false, new Error(' '));
    }
    if (file == undefined) {
      req.flash('erro_msg', 'selecione um arquivo');
      return cb(null, false, new Error(' '));
    }

    cb(null, true);
  }
}).single('file');

router.post('/dashboard', (req, res) => {
  upload(req, res, err => {
    let model = new Model();
    let erro = [];
    if (req.file == undefined) {
      erro.push({ text: 'Somente arquivos xlsx' });
    }
    if (erro.length > 0) {
      res.redirect('/dashboard');
    } else {
      let xlsx = `./public/uploads/${req.file.filename}`;
      mongoXlsx.xlsx2MongoData(xlsx, model, function(err, data) {
        let modelo = new Model({
          data: data,
          usuario: req.user._id
        });

        modelo.save().then(() => {
          //fs.unlink(`./public/uploads/file-${req.user.id}.xlsx`)
          res.redirect('/dashboard');
        });
      });
    }
  });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Model.findOne({ usuario: req.user._id })
    .populate('usuario')
    .then(data => {
      res.render('dashboard', {
        data: data,
        dashboardUsuario: req.user
      });
    });
});

router.put('/dashboard', (req, res) => {
  upload(req, res, err => {
    if (req.file == undefined) {
      req.flash('erro_msg', 'Selecione um arquivo');
      res.redirect('/dashboard');
    } else {
      Model.findOne({ usuario: req.user._id }).then(usuario => {
        let model = new Model();
        let xlsx = `./public/uploads/${req.file.filename}`;
        mongoXlsx.xlsx2MongoData(xlsx, model, function(err, data) {
          let modelo = new Model({
            data: data,
            usuario: req.user._id
          });
          usuario.data = modelo.data;
          usuario.usuario = modelo.usuario;
          usuario.save().then(() => {
           //fs.unlink(`./public/uploads/file-${req.user.id}.xlsx`);
            res.redirect('/dashboard');
          });
        });
      });
    }
  });
});

router.delete('/dashboard', (req, res) => {
  Model.deleteOne({ usuario: req.user.id }).then(() => {
    fs.unlink(`./public/uploads/file-${req.user.id}.xlsx`, () => {});
    req.flash('sucesso_msg', 'Planilha deletada com sucesso')
    res.redirect('/dashboard');
  });
});

module.exports = router;
