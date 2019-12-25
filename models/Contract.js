const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  studentID: String,
  tutorID: String,
  studentName: String,
  tutorName: String,
  rentHours: Number,
  price: Number,
  startDate: Date,
  endDate: Date,
  contractCreationDate: Date,
  currentStatus: String,
  statusHistory: [{
    date: Date,
    content: String,
    status: String
  }]
});

module.exports = mongoose.model('Contract', contractSchema);