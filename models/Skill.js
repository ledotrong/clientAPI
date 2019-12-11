const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  
  isDeleted:{
    type: Boolean,
    default: false
  },
  name:{
      type: String,
      default:null
  }
});

module.exports = mongoose.model('Skill', skillSchema);