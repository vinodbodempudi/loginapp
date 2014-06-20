var Db = require('mongodb').Db;
var Connection = require('mongodb').connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectId;

LoginUser = function(host, port){
this.db = new Db('loginuser', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
this.db.open(function(){});
};

LoginUser.prototype.getCollection=function(callback){
this.db.collection('users', function(error, users_collection){
   if(error) callback(error);
   else callback(null, users_collection);
});
};

LoginUser.prototype.save = function(user, callback){
this.getCollection(function(error, users_collection){
  if(error) callback(error)
  else{
    users_collection.insert(user, function(){
	 callback(null, user);
	});
}

});
};

LoginUser.prototype.login = function(email, callback){
this.getCollection(function(error, users_collection){
  if(error) callback(error)
  else{
    users_collection.find({'email':email}).nextObject( function(error, result){
	 if(error) callback(error)
	 else{
	 console.log(result);
     callback(null, result)
	 }
	});
	}

});
};

LoginUser.prototype.list = function(callback){
this.getCollection(function(error, users_collection){
  if(error) callback(error)
  else{
    users_collection.find().toArray(function(error, results){
	 if(error) callback(error)
	 else{
     console.log(results[0]);
     callback(null, results)
	 }
	});
	}

});
};


exports.LoginUser = LoginUser;
