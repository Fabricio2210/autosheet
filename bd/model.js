const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModeloSchema = new Schema({
  data: {
    type: Array,
    require: true
  },
  dataUltima:{
    type:Array
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'usuario'
  }
});

mongoose.model('modelo', ModeloSchema);
