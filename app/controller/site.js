var Topic = require('../model').Topic;
var User = require('../model').User;

exports.aside = function(req, res) {
	var ret = {
		users: [],
		topics: []
	};
	var userPromise = User.active();
	var topicPromise =  Topic.hot();

	userPromise.then(function(users) {
 		ret.users = users;
 		return topicPromise;
 	}).then(function(topics) {
 		topics.forEach(function(item) {
 			item = item.toJSON();
 			item.comments = item.comments.length;
 			ret.topics.push(item);
 		});
 	}).then(function() {
 		res.send(ret);
 	}, function(err) {
 		res.send(500);
 	});
}

/*	async.parallel([
	function(cb) {
		User.find().sort({ score: -1 }).limit(5).exec(function(err, users) {
			if (err) return cb(cb);
			ret.users = users;
			cb();
		});
	},
	function(cb) {
		Topic.find().select('-__v -body -updateAt')
										.sort({ views: -1 })
										.limit(5)
										.populate('user', 'username avatar').exec(function(err, topics) {
												if (err) return cb(cb);
												ret.topics = topics;
												cb();
										});
	
	}
], function(err) {
	if (err) res.send(500);
	console.log(Date.now() - now);
	res.send(ret);
});*/