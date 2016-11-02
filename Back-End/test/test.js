// process.env.NODE_ENV = 'test';
// used in development stage
var chai = require('chai');
//used to do http request
var chaiHttp      = require('chai-http'),
    mongoose      = require('mongoose'),
    server        = require('../app'),
    Advertisement = require('../models/Advertisement'),
    User          = require('../models/User');

var should = chai.should();
chai.use(chaiHttp);


/*
 |-----------------------------------------------------------
 | Homepage get test
 |-----------------------------------------------------------
*/
describe('homepage', function() {
  it('should get the homepage', function(){
    chai.request(server)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      })
  })
});


/*
 |-----------------------------------------------------------
 | Get Advertisement detail page
 |-----------------------------------------------------------
*/
describe('GET Avertisement/:id', function() {
  it('should get single advertisement', function() {
    var advertisement = new Advertisement({
      name : "Macbook",
      specification : "256, 4GB",
      quantity : "1",
      shipping : "Mumbai",
      price : "600",
      status : true,
      userId : "580741b5828c703cd287fa0c",
      biddingStatus : true,
      biddingStartTime: Date.now()
    });
    advertisement.save(function(err, advertisement){
      chai.request(server)
        .post('/api/getAdvertisementDetail/'+advertisement._id)
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('name');
          res.body.should.have.property('specification');
          res.body.should.have.property('quantity');
          res.body.should.have.property('shipping');
          res.body.should.have.property('price');
          res.body.should.have.property('status');
          res.body.should.have.property('userId');
          res.body.should.have.property('biddingStatus');
          res.body.should.have.property('biddingStartTime');
          res.body.should.have.property('_id').eql(advertisement._id);
          done();
        })
    })
  })
});


/*
 |-----------------------------------------------------------
 | test for all Advertisements
 |-----------------------------------------------------------
*/
describe('GET all advertisements', function() {
  var req = {
          user: {
              _id: '580741b5828c703cd287fa0c'
            }
          };
  it('should get all advertisements', function() {
    var advertisement = new Advertisement({
      name : "Macbook",
      specification : "256, 4GB",
      quantity : "1",
      shipping : "Mumbai",
      price : "600",
      status : true,
      userId : "580741b5828c703cd287fa0c",
      biddingStatus : true,
      biddingStartTime: Date.now()
    });
    advertisement.save(function(err){
      chai.request(server)
        .post('/')
        .end(function(err, res){
          console.log("-------get all advertisements--------");
          console.log(res.body);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body[0].should.have.property('name');
          res.body[0].should.have.property('specification');
          res.body[0].should.have.property('quantity');
          res.body[0].should.have.property('shipping');
          res.body[0].should.have.property('price');
          res.body[0].should.have.property('status');
          res.body[0].should.have.property('userId');
          res.body[0].should.have.property('biddingStatus');
          res.body[0].should.have.property('biddingStartTime');
          // res.body[0].should.have.property('_id');
          done();
        })
    });
  });
});

/*
 |-----------------------------------------------------------
 | test for user sold and purchasedItems
 |-----------------------------------------------------------
*/
describe('GET user soldItems', function() {
  User.collection.drop();

  beforeEach(function(done){
    var purchasedItems = [],
        soldItems = [],
        req = {
            user: {
                _id: '580741b5828c703cd287fa0c'
              }
            };
    soldItems.push({
      adId: '580db29280c1980615352788',
      quantityEntered: '1'
    });
    var user = new User({
     firstName: 'Darshan',
     lastName: 'Sapaliga',
     username: 'darshan009781',
     password: '123',
     purchasedItems: purchasedItems,
     soldItems: soldItems
    });
    user.save(function(err){
      done();
    });
  });

  afterEach(function(done){
    User.collection.drop();
    done();
  });

  it('should get user sold items', function() {
    chai.request(server)
      .post('/api/soldItems')
      .end(function(err, res){
        console.log("-------get sold advertisements--------");
        console.log(res.body);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('quantityEntered');
        // res.body[0].should.have.property('specification');
        done();
      })
  });
});


describe('GET user purchasedItems', function() {
  User.collection.drop();

  beforeEach(function(done){
    var purchasedItems = [],
        soldItems = [],
        req = {
            user: {
                _id: '580741b5828c703cd287fa0c'
              }
            };
    purchasedItems.push({
      adId: '580db29280c1980615352788',
      quantityEntered: '1'
    });
    var user = new User({
     firstName: 'Darshan',
     lastName: 'Sapaliga',
     username: 'darshan009781',
     password: '123',
     purchasedItems: purchasedItems,
     soldItems: soldItems
    });
    user.save(function(err){
      done();
    });
  });

  afterEach(function(done){
    User.collection.drop();
    done();
  });

  it('should get user purchased items', function() {
    chai.request(server)
      .post('/api/purchasedItems')
      .end(function(err, res){
        console.log("-------get purchased advertisements--------");
        console.log(res.body);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('quantityEntered');
        // res.body[0].should.have.property('specification');
        done();
      })
  });
});
