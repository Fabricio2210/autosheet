const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  nome: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  desenvolvedor: {
    type: Boolean,
  },
  plantonista: {
    type: Boolean,
  },
  
  senha: {
    type: String,
    require: true
  },

  data: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('usuario', UsuarioSchema);
