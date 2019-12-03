const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  picture: {
    type: String,
    default: 'https://image.flaticon.com/icons/svg/145/145846.svg'
  },
  skills: {
    type: Array,
    required: false,
    default: []
  },
  role: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false,
    min: 10
  },
  date: {
    type: Date,
    default: Date.now
  },
  activated: {
    type: Boolean,
    default: false
  },
  facebookProvider: {
    type: {
        id: String,
        token: String
    },
    select: true
},
googleProvider: {
    type: {
        id: String,
        token: String
    },
    select: true
}
});

module.exports = mongoose.model('User', userSchema);
