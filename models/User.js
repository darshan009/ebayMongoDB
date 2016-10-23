var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    crypto = require('crypto');
    // rabbit = require('../config/rabbitmq');

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: {type: String, unique: true},
  email: {type: String, unique: true},
  password: String,
  birthday: Date,
  contactNo : Number,
  location: String,
  lastLoginTime: Date,
  bids: {
    adId: {type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement'},
    quantityEntered: Number,
    biddingValue: Number
  },
  purchasedItems: [{
    adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement' },
    quantityEntered: Number
  }],
  soldItems: [{
    adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement' },
    quantityEntered: Number
  }]
});

//hashing
userSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password'))
  {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt){
    if(err)
      return next(err);
    bcrypt.hash(user.password,salt,null,function(err, hash){
      if(err)
        return next(err);
      user.password = hash;
      next();
    });
  });
});

//compare hashed password
userSchema.methods.comparePassword = function(password, callback){
  var user = this;
  bcrypt.compare(password, user.password, function(err, isMatch){
    if(err)
      return callback(err);
    callback(null,isMatch);
  });
}

module.exports = mongoose.model('User', userSchema);
