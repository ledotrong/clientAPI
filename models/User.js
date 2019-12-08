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
    type: {
      address: String,
      ward: String,
      district: String,
      province: String
    },
    required: false
  },
  introduction: {
    type: String,
    required: false
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
    }
  },
  googleProvider: {
    type: {
      id: String,
      token: String
    }
  }
});

module.exports = mongoose.model('User', userSchema);
