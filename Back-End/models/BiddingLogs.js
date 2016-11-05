var mongoose = require('mongoose');

var biddingLogs = new mongoose.Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement'},
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  click: String,
  date: Date
});

module.exports = mongoose.model('BiddingLogs', biddingLogs);
