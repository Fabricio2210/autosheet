const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSchema = new Schema({
  destinatario: {
    type: String,
    require: true
  },
  remetente: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true
  },
  usuario: {
    type: String
  },
  usuarioNome: {
    type: String
  },
  ferias: {
    type: Boolean,
  },
  comeco: {
    type: String
  },
  fim: {
    type: String
  }
});

mongoose.model('email', EmailSchema);
