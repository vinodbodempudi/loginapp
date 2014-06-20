
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var LoginUser = require('./loginuser').LoginUser;
var imagesdb = require('./imagesdb').imagesdb;
//var formidable = require('formidable');
var fs = require('fs');

var app = express();

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

var loginUser= new LoginUser('localhost', 27017);
var imagesdb= new imagesdb('localhost', 27017);
var Users= new Users('localhost', 27017);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/', function(req, res) {
    res.render('login', {
        title: 'login'
    });
});
app.get('/createUser', function(req, res) {
    res.render('createUser', {
        title: 'signUp'
    });
});
app.post('/signUp', function(req, res) {
     loginUser.save({
	  name: req.param('name'),
	  email: req.param('email'),
	  password: req.param('password')
	 }, function(error, docs){
	    res.redirect('/')
	 });
	 });
	 
app.post('/login', function(req, res) {
   loginUser.login(req.param('email'),
					function(error, user){
					res.render('userProfile', {user: user});
					});
	
});
   
app.get('/userlist', function(req, res) {
   loginUser.list(function(error, users){
					res.render('userlist', {"users": users});
					});
					
	
});

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


app.post('/upload', function(req, res){
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
 
 
 
 
 
 
 
 
 //fathome 
 
 app.get('/properties', function(req, res) {
   
   console.log('got request from angular');
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
   res.send([{type:'land'}, {beds:'4'}]);
   
});
 
 
app.get('/users', function(req, res){
   console.log('get Users');
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    Users.list(function(error, users){
					res.send(users);
					});
   
   res.send(users);});
   
app.get('/users/:email/:password', function(req, res){
 
   console.log('got request from angular');
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
   
	
	var userFound;
	for(var user in users){
	    
		if(user.email == req.param('email') && user.password== req.param('password'))
		{
		   userFound = user;
		}
	
	}
   
   res.send(userFound);});
app.post('/users', function(req, res){

 var user = req.body;
    console.log('Added user: ' + JSON.stringify(user));
   
});

app.put('/users/:id', function(req, res){});
app.delete('/users/:id', function(req, res){});


 
 
 
 
 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});