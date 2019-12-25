const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  users: 
  {
      type: [], //chứa 2 id của 2 ng chat
      default: []
  },
    message: {
      type: [{}],
      default: [{}]
    },
    newMessage:{
      type: Boolean,
      default: true
    },
    time: {
      type: Date,
      default: new Date()
    },
    numOfNewMessages: {
      type: Number,
      default: 0
    }
});

module.exports = mongoose.model('Message', messageSchema);