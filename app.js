var express = require('express');
var app = express();
var config = require('./var/config');
var path = require('path');
var MongoStore = require('connect-mongo')(express);

/**
 * Code standard: http://nodeguide.com/style.html
 */

app.configure(function() {
	 app.use(express.compress());
	//app.use(express.logger());
  app.set('view engine', 'ejs');
  
 	app.use(express.bodyParser());
  app.use(express.methodOverride());

  // cookieParser should be above session
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'flyhtml',
    store: new MongoStore({
      url: config.db
    })
  }));
	app.use(app.router);
});

app.configure('development', function(){
  app.use(express.static(__dirname + '/asset/dev', { maxAge: 24 * 60 * 60 * 1000 }));
  app.set('views', path.join(__dirname, 'app/view/dev'));
});

app.configure('production', function(){
  app.use(express.static(__dirname + '/asset/dist', { maxAge: 24 * 60 * 60 * 1000 }));
  app.set('views', path.join(__dirname, 'app/view/dist'));
});

// assume 404 since no middleware responded
app.use(function(req, res, next) {
  res.redirect('#' + req.originalUrl.replace(/^\//, ''));
});


//load app
require('./app/controller')(app);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('app started on port '+ port);