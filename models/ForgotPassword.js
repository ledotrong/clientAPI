const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  email: String,
  code: String,
  status: Number,
  time: Date
});

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);