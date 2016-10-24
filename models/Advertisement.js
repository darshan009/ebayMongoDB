var mongoose = require('mongoose');

var advertisementSchema = new mongoose.Schema({
  name : String,
  specification : String,
  quantity : Number,
  shipping : String,
  price : Number,
  status : Boolean,
  userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  biddingStatus : Boolean,
  biddingStartTime: Date,
  lastBid: {
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: Date,
    quantityEntered: Number,
    biddingValue: Number
  },
  biddingLogs: [{
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: Date,
    quantityEntered: Number,
    biddingValue: Number
  }]
});

module.exports = mongoose.model('Advertisement', advertisementSchema);
