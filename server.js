var express = require('express');
var formidable = require('formidable');
var fs = require('fs');

var env = process.env.NODE_ENV || 'dev';

var app = express();

app.set('views', __dirname + '/src/views')
app.set('view engine', 'jade')
app.use('/public', express.static(__dirname + '/public'))

var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='image'/>" +
"<input type='submit' /></form>" +
"</body></html>";

function base64Encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

function base64Decode(base64str, path) {
    var bitmap = new Buffer(base64str, 'base64').toString('binary');
    fs.writeFileSync(path, bitmap);
}

app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html' });
  res.end(form);
});

app.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    // console.log(files);
    var image = files.image;
    var file = image.path;

    var base64 = 'data:' + image.type + ';base64,' + base64Encode(file);
    res.render('index', { title: 'Success',
        message: 'Image received.',
        image: base64});
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  console.log(env);
});
