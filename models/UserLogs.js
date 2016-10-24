var mongoose = require('mongoose');

var userLogs = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  click: String,
  date: Date
});

module.exports = mongoose.model('UserLogs', userLogs);
