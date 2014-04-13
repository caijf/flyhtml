//Bootstrap models
require('../model');
var user = require('./user');
var topic = require('./topic');
var comment = require('./comment');
var site = require('./site');

module.exports = function(app) {
	var auth = user.requiresLogin;
	
	//login
	app.post('/session', user.login);
	//logout
	app.delete('/session/:uid', user.logout);
	
	
	//user routes
	app.get('/pjax/users', user.list);
	app.get('/pjax/users/:name', user.detail);
	app.get('/pjax/users/:uid/topics', user.topics);
	app.get('/pjax/users/:uid/likes', user.likes);
	app.get('/pjax/users/:uid/comments', user.comments);

	app.post('/pjax/users', user.create);
	// user update
	app.get('/user/check', user.check);
 
	//app.put('/user', user.update);
	//app.post('/pjax/user', user.create);


	//topic get list
	app.get('/pjax/topics', topic.list);

	// Topic get
	app.get('/pjax/topics/:tid', topic.detail);

  // Topic update
  app.patch('/pjax/topics/:tid', auth, topic.update);

  // Topic comment
	app.post('/pjax/topics/:tid/comments', auth, comment.create);
	app.delete('/pjax/topics/:tid/comments/:cid', auth, comment.remove);
	app.put('/pjax/topics/:tid/comments/:cid', auth, comment.update);
  

	// user reply topic
	//app.get('/pjax/topic/reply/:uid', topic.reply);
	// user Favorites topic
 // app.get('/pjax/topic/favorite/:uid', topic.favorite);

	// topic create
	app.post('/pjax/topics', user.requiresLogin, topic.create);
	

	// site
	app.get('/aside', site.aside);
}