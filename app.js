const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const keys = require('./keys');

//conexão Bd
mongoose.Promise = global.Promise;
mongoose
  .connect(keys.mongoURI,{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//modelos de schema para Bd
require('./bd/usuarios');
const User = mongoose.model('usuario');
require('./bd/model');
const Model = mongoose.model('modelo');
require('./bd/email');
const Email = mongoose.model('email');

//Passport middleware para sessão
require('./bd/passport')(passport);

//Variáveis das rotas
const index = require('./rotas/index');
const cadastro = require('./rotas/cadastro');
const outros = require('./rotas/outros');
const dashboard = require('./rotas/dashboard');
const email = require('./rotas/email');
const edit = require('./rotas/edit');
const novaSenha = require('./rotas/novaSenha');
const cadastroSenha = require('./rotas/cadastroSenha');

//cron jobs
const cronTimesheet = require('./cronJobs/cronTimesheet');
const cronNovaPlanilha = require('./cronJobs/cronNovaPlaninha');

//express
const app = express();

//express arquivos estásticos
app.use(express.static(path.join(__dirname, 'public')));

//middleware bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Helpers Handlebars
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon,
  maiuscula
} = require('./helpers/hbs');

//middleware handlebars
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      select: select,
      editIcon: editIcon,
      maiuscula:maiuscula
    },
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

//middleware  cookieparser
app.use(cookieParser());

app.use(
  session({
    secret: 'woot',
    resave: true,
    saveUninitialized: true,
    cookie:{_expires : 90000000}
  })
);

//middleware flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//funções globais
app.use(function(req, res, next) {
  res.locals.erro_msg = req.flash('erro_msg');
  res.locals.sucesso_msg = req.flash('sucesso_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Rotas
app.use(index);
app.use(cadastro);
app.use(outros);
app.use(dashboard);
app.use(email);
app.use(edit);
app.use(novaSenha);
app.use(cadastroSenha);

//Cronjobs
cronTimesheet;
cronNovaPlanilha;

//Servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor na porta ${port}`);
});
