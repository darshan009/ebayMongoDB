// process.env.NODE_ENV = 'test';
// used in development stage
var chai = require('chai');
//used to do http request
var chaiHttp      = require('chai-http');
    server        = require('../app');

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

describe('login test', function() {
  it('should have status 200', function(){
    chai.request(server)
      .post('/api/login', {
        form: {
          email: 'darshan.rocks00981@gmail.com',
          password: '123'
        }
      })
      .end(function(err, res){
        res.should.have.status(200);
        done();
      })
  })
});

describe('profile page test', function() {
  it('should have status 200', function(){
    chai.request(server)
      .get('/profile/personalDetails')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      })
  })
});

describe('soldItems page test', function() {
  it('should have status 200', function(){
    chai.request(server)
      .get('/profile/soldItems')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      })
  })
});

describe('adding Advertisement test', function() {
  it('should have status 200', function(){
    chai.request(server)
      .post('/api/addAdvertisement', {
        form: {
          name : 'Test Mocha',
          specification : 'Test mocha',
          quantity : '12',
          shipping : 'mumbai',
          price : '12',
          status : true
        }
      })
      .end(function(err, res){
        if(err)
          console.log(err);
        res.should.have.status(200);
        done();
      })
  })
});


// 	it('CHECK CART ADDITION IS CORRECT', function(done) {
// 		request.post('http://localhost:3000/cart', {
// 			form : {
// 				pid : '90'
// 			}
// 		}, function(error, response, body) {
// 			assert.equal(200, response.statusCode);
// 			done();
// 		});
// 	});
//
//     it('CHECK IF CART IS RENDERED CORRECT', function(done) {
//         request.post(
//             'http://localhost:3000/yourCart',
//             { form: { } },
//             function (error, response, body) {
//                 assert.equal(200, response.statusCode);
//                 done();
//             }
//         );
//     });
// });
