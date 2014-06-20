
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
//var LoginUser = require('./loginuser').LoginUser;
//var imagesdb = require('./imagesdb').imagesdb;
var formidable = require('formidable');
var fs = require('fs');

var app = express();
var AWS = require('aws-sdk'); 
	AWS.config.loadFromPath('./config.json');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//var loginUser= new LoginUser('localhost', 27017);
//var imagesdb= new imagesdb('localhost', 27017);
//var Users= new Users('localhost', 27017);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);


app.get('/files', function(req, res){
   res.render('files');
});

app.post('/uploadnew', function(req, res, next){
    
    var input = req.body;
    imagesdb.save(input, req.files.image, function(error, objects){
       if(err){
        console.log('error');
		}
        else{
         res.redirect('/showimage');
        }
    

        //res.redirect('/showimage');    
        //res.writeHead(200, {'content-type': 'text/html'});
        //res.write('received image:<br/>');
		//res.write("<img src='../showimage' />");
        //res.end();
          
	});
});

app.post('/uploadold', function(req, res){
     var form = new formidable.IncomingForm();
	 form.parse(req, function(err, fields, files){
	  console.log('filename'+files.image.name);
      console.log('path'+files.image.path);
    
	fs.writeFile(files.image.name, files.image, 'utf8', function(err){
         if(err) {
           console.log(err);
          throw err;
}
         console.log('It\'s saved!');
         });
        res.redirect('/showimage');    
        //res.writeHead(200, {'content-type': 'text/html'});
        //res.write('received image:<br/>');
		//res.write("<img src='../showimage' />");
        //res.end();
          
	});
});


app.post('/uploadapp', function(req, res){
     var form = new formidable.IncomingForm();
	 form.parse(req, function(err, fields, files){
	  console.log('filename'+files.image.name);
      console.log('path'+files.image.path);
    
	 var input = req.body;
    imagesdb.savenew(input, files.image, function(error, objects){
       if(err){
        console.log('error');
		}
        else{
         res.redirect('/files');
        }
            
	});
   });
});

app.post('/uploadS3', function(req, res){
     
	  var form = new formidable.IncomingForm();
	 form.parse(req, function(err, fields, files){
	  console.log('filename'+files.image.name);
      console.log('path'+files.image.path);
    
	 fs.readFile(files.image.path, function (err, data) {

		var imageName = files.image.name

		/// If there's an error
		if(!imageName){

			console.log("There was an error")
			res.redirect("/");
			res.end();

		} else {
         // console.log(imageName);
		 // var newPath = "C:\\noscan\\loginapp\\images\\"+imageName;
			//console.log('newPath'+newPath);
		  // write file to uploads/fullsize folder
		  //fs.writeFile(newPath, data, function (err) {

		  	// let's see it
			var s3bucket = new AWS.S3();
				s3bucket.createBucket(function() {
				var d = {
					Bucket: 'fathome-images',
					Key: imageName,
					Body: data,
					ACL: 'public-read'
					};				
					s3bucket.putObject(d, function(err, res) {
			if (err) {
				console.log("Error uploading data: ", err);
			} else {
				console.log("Successfully uploaded data to myBucket/myKey");
			}
			});
			});
			
			
			
			//console.log("There was an error writing to folder");
			//console.log(err);
		  	res.redirect("/");

		  }
		});
	});
	
	
   });



app.post('/upload', function(req, res){
     
	  var form = new formidable.IncomingForm();
	 form.parse(req, function(err, fields, files){
	  console.log('filename'+files.image.name);
      console.log('path'+files.image.path);
    
	 fs.readFile(files.image.path, function (err, data) {

		var imageName = files.image.name

		/// If there's an error
		if(!imageName){

			console.log("There was an error")
			res.redirect("/");
			res.end();

		} else {
          console.log(imageName);
		  var newPath = "C:\\noscan\\loginapp\\images\\"+imageName;
			console.log('newPath'+newPath);
		  //write file to uploads/fullsize folder
		  fs.writeFile(newPath, data, function (err) {

		 	if(err)	
			   console.log("There was an error writing to folder");
			else
			   console.log(err);
		  	res.redirect("/");

		  });
		}
		});
	});
	
	
   });   
	 


app.get('/showimage',function(req, res){
     
     console.log("reading image");
     fs.readFile('./OM.png', function(err, file){
       res.writeHead(200, {'content-type':'image/png'});
       //res.contentType(file.imageType);
        // res.contentType = 'image/png';
       //console.log(file.type);
     //var data = fs.createWriteStream('./OM.png');  
	
    //var img = fs.readFileSync('./OM.png');
     //res.writeHead(200, {'Content-Type': 'image/gif' });
//res.writeHead(200, {'content-type':'image/png'});
//res.contentType = 'image/png';
     res.end(file, 'binary');

    //res.writeHead(200, {'content-type':'image/png'});		
	//res.pipe(data); 
      //  res.end();   

 //res.end(file);
     

 //res.writeHead(200, {'Content-Type': 'text/html'});
  //res.write('<html><body><img src="data:image/jpeg;base64,')
  //res.write(new Buffer(data).toString('base64'));
  //res.end('"/><</body></html>');   

		});
     
});

app.get('/viewimage',function(req, res){
     
     console.log("reading image");
     var id = '5293deed6a22096c08000001';
     imagesdb.getimage(id, function(err, image){
        if(err) console.log(err);
        if(image){
        console.log('something in it') ;
        }
        res.writeHead(200, {'content-type':'image/png'});
        res.end(image.image.buffer, 'binary');
        });
});
 
 
 
 
 
 
 
 
 http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});