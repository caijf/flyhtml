var User = require('../model').User;
var Topic = require('../model').Topic;
var async = require('async');

exports.login = function(req, res) {
	User.findOne({
		username: req.body.username
	}, function(err, user) {
		if (err) return res.status(500);
		if (!user) return res.send({ error: 'Donot find this user' });
		if (user.authPassword(req.body.password)) {
			req.session.user = user.toJSON();
			if (req.body.remember) {
				req.session.cookie.expires = new Date(Date.now() +  1000 * 60 * 60 * 24);
			} else {
				req.session.cookie.expires = null;
			}
			res.send({ success: 'Auth success' });			
		} else {
			res.send({ error: 'Password wrong' });
		}
	});
}
exports.logout = function(req, res) {
	req.session.destroy();
	res.send({});
}

exports.create = function(req, res) {
	var user = new User(req.body);
	user.save(function(err, user) {
		if (err) {
			return res.status(422).send({ err: err});
		}
		res.send({ success: 'Account register successfully' });
	});
}

exports.check = function(req, res, next) {
	var username = req.query.username;
	var email = req.query.email;
	if (username) {
		User.findOne({
			username: username
		}, function(err, user) {
			if (err) return next(err);
			if (user) {
				res.send({ error: 'Username already exist.'});
			} else {
				res.send({ success: 'Username is available.'});
			}
		});
	} else if(email) {
		User.findOne({
			email: email
		}, function(err, user) {
			if (err) return next(err);
			if (user) {
				res.send({ error: 'Email already exist.'});
			} else {
				res.send({ success: 'Email is available.'});
			}
		});
	} else {
		res.send({ error: 'Query must need username or email'});
	}
}

exports.requiresLogin = function(req, res, next) {
	if (!req.session.user) return res.send(401); 
	next();
}
/*
 * User rank list
 */
exports.list = function(req, res) {
	var options = {
		perPage: 15,
		page: req.query.page || 1
	};
	var ret = {
		users: [],
		perPage: options.perPage,
		page: options.page
	};
	var listPromise = User.list(options);
	var countPromise = User.count().exec();

	listPromise.then(function(users) {
		var i = 1 + (options.perPage * (options.page - 1));

		users.forEach(function(item) {
			item = item.toJSON();
			item.rank = i++;
			ret.users.push(item);
		});
		return countPromise;
	}).then(function(count) {
		ret.count = count;
	}).then(function() {
		res.send(ret);
	}, function(err) {
		res.send(500);
	});
}

/*
 * User detail
 */
exports.detail = function(req, res) {
	var username = req.params.name;
	
	User.findOne({ username: username }, function(err, user) {
		if (err) return res.send(500);
		if (!user) return res.send(404);
		res.send(user);
	});
}

var handlerTopics = function(topics) {
	var ret = [];

	topics.forEach(function(item) {
		item = item.toJSON();
		item.comments = item.comments.length;
		item.likes = item.likes.length;
		item.votes = item.votes.length;
		ret.push(item);
	});
	return ret;
}

/*
 * User topics
 */
exports.topics = function(req, res) {
	var opts = {
		user: req.params.uid
	};

	Topic.list({ criteria : opts }).then(function(topics) {
		res.send(handlerTopics(topics));
	}, function(err) {
		res.send(err);
	});
}

/*
 * User topics
 */
exports.likes = function(req, res) {
	var opts = {
		likes: req.params.uid //contains
	};

	Topic.list({ criteria : opts }).then(function(topics) {
		res.send(handlerTopics(topics));
	}, function(err) {
		res.send(err);
	});
}

/*
 * User topics
 */
exports.comments = function(req, res) {
	var opts = {
		comments: req.params.uid //contains
	};

	Topic.list({ criteria : opts }).then(function(topics) {
		res.send(handlerTopics(topics));
	}, function(err) {
		res.send(err);
	});
}
