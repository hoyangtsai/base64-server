var express = require('express');


var formidable = require('formidable');
var util = require('util');

var fs = require('fs');

var app = express();


app.set('views', __dirname + '/src/views')
app.set('view engine', 'jade')
// app.use(express.logger('dev'))

app.use('/public', express.static(__dirname + '/public'))

// app.get('/', function (req, res) {
//   res.render('index', { title: 'Hey', message: 'Hello there!'});
// })


var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='image'/>" +
"<input type='submit' /></form>" +
"</body></html>";


function base64Encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html' });
  res.end(form);
});

// Post files
app.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    // res.writeHead(200, {'content-type': 'text/plain'});
    // res.write('received upload:\n\n');
    // res.end(util.inspect({fields: fields, files: files}));

    console.log(files);

    var file = files.image.path;
    var imageName = files.image.name;

    var newPath = __dirname + '/img/' + imageName;

    var base64 = base64Encode(file);
    res.redirect('/show' + base64);

    // fs.writeFile(newPath, files.image, function (err) {
    //   res.redirect('/display/' + imageName);
    // });

  });

});

app.get('/show/:base64', function (req, res) {
  console.log(req.params.base64);

  // res.end(util.inspect({base64: base64, req: req, res: res}));
});

// Show files
app.get('/display/:file', function (req, res){
  file = req.params.file;
  var img = fs.readFileSync(__dirname + '/img/' + file);
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});