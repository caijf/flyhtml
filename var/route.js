var user = require('../app/controller/user');
var topic = require('../app/controller/topic');
module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {
			user: req.session.user || {}
		});
	});
	//login
	app.post('/session', user.session);
	//logout
	app.get('/removesession', user.sessionRemove);
	//user routes
	app.get('/pjax/user', user.sessionGet);
	app.post('/pjax/user', user.create);
	// user update

	app.get('/pjax/user/check', user.check);


	//topic get list
	app.get('/pjax/topic', topic.index);
	// topic get
	app.get('/pjax/topic/:tid', topic.detail);
	// topic create
	app.post('/pjax/topic', user.requiresLogin, topic.create);
	// topic update
	app.patch('/pjax/topic/:tid', user.requiresLogin, topic.update);
}