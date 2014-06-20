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


app.get('/files', function (req, res) {
    res.render('files');
});



app.post('/upload', function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log('filename' + files.image.name);
        console.log('path' + files.image.path);

        fs.readFile(files.image.path, function (err, data) {

            var imageName = files.image.name

            /// If there's an error
            if (!imageName) {

                console.log("There was an error")
                res.redirect("/");
                res.end();

            } else {
                console.log(imageName);
                var newPath = "C:\\noscan\\loginapp\\images\\local\\" + imageName;
                console.log('newPath' + newPath);
                //write file to uploads/fullsize folder
                fs.writeFile(newPath, data, function (err) {

                    if (err)
                        console.log("There was an error writing to folder");
                    else
                        console.log(err);
                    res.redirect("/");

                });
            }
        });
    });


});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});