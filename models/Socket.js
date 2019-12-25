const mongoose = require('mongoose');

const socketSchema = new mongoose.Schema({
  
  socketID:{
    type: String
  },
  userID:{
      type: String
  }
});

module.exports = mongoose.model('Socket', socketSchema);