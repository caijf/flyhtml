/**
 * Code standard: http://nodeguide.com/style.html
 */
var express = require('express');
var app = express();
var config = require('./var/config');
var path = require('path');
var env = process.env.NODE_ENV || 'development';
var fs = require('fs');

app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(require('cookie-session')({
  key: 'flyhtml',
  secret: 'nothing'
}));

//Environment configure
if (env === 'development') {
  app.use(express.static(__dirname + '/asset/dev'));
  app.set('views', __dirname + '/asset/dev');
} else {
  app.use(express.static(__dirname + '/asset/dest', { maxAge: 24 * 60 * 60 * 1000 }));
  app.set('views', __dirname + '/asset/dest');
}

//load app
require('./app/controller')(app);

//assume 404 since no middleware responded
app.use(function(req, res, next) {
  var indexHtml = fs.readFileSync(path.join(app.get('views'), 'index.html'), 'utf-8');
  res.send(indexHtml);
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('app started on port '+ port);