// var mongoose     = require('mongoose'),
//     secrets      = require('./secrets'),
//     connectionPool = [];
//
// //mongoose connection
// for(var i=0; i<50; i++) {
//   mongoose.connect(secrets.mongodburl, function(err, db){
//     if(err)
//       console.log("connection error");
//     else {
//       connectionPool.push(db);
//     }
//   });
// }
//
// exports.connection = function(url, callback) {
//   if(connectionPool.length > 0) {
//     db = connectionPool.pop();
//     callback(db);
//   }else {
//     //handle empty connection
//     console.log("connection busy");
//   }
// };

// mongoose.connection.on('error', console.error.bind(console, 'connection error'));
// mongoose.connection.once('open', function callback(){
//   console.log("Mongoose connected to mongolab");
// });
//
// module.exports = connection;
