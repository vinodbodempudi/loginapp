var MongoDb = require('mongodb');
var Db = require('mongodb').Db;
var Connection = require('mongodb').connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');

imagesdb = function(host, port){
this.db = new Db('imagesdb', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
this.db.open(function(){});
};

imagesdb.prototype.getCollection=function(callback){
this.db.collection('images', function(error, images_collection){
   if(error) callback(error);
   else callback(null, images_collection);
});
};

imagesdb.prototype.save = function(input, image, callback){
 if(image && image.length) {
    var data = fs.readFile(image.path);
    input.image = new MongoDb.Binary(data);
    input.imageType = image.type;
    input.imageName = image.name;
	}
  this.getCollection(function(error, images_collection){
        if(error) callback(error);
        else{
      images_collection.save(input, {safe:true}, callback);   
		}
	});  
 
};

imagesdb.prototype.savenew = function(input, image, callback){
 //if(image && image.length) {
    
    console.log(image.path);
    fs.readFile(image.path, function(error, data){
       input.image = new MongoDb.Binary(data);
       input.imageType = image.type;
       input.imageName = image.name;
	});
    
    
	//}
  
  this.getCollection(function(error, images_collection){
        if(error) callback(error);
        else{
      images_collection.save(input, {safe:true}, callback);   
		}
	});  
 
};

imagesdb.prototype.getimage = function(id, callback){
 
  this.getCollection(function(error, images_collection){
        if(error) callback(error);
        else{ 
      images_collection.find({_id: new ObjectId(id)}).nextObject( function(error, image){   
		if(error) callback(error)
	 else{
        console.log(image);
		console.log(image.type);
		console.log(image.name);
		callback(null, image)
	     }
		});

		}
	});  
 
};



exports.imagesdb = imagesdb;
