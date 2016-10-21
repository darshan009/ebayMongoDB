var mongoose = require('mongoose');

var advertisementSchema = new mongoose.Schema({
  name : String,
  specification : String,
  quantity : Number,
  shipping : String,
  price : Number,
  status : Boolean,
  userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  biddingStatus : Boolean
});

module.exports = mongoose.model('Advertisement', advertisementSchema);
