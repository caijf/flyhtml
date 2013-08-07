var Topic = require('../model').Topic;
var User = require('../model').User;
var config = require('../../var/config');

exports.list = function(req, res) {
	var page = req.query.page || 1;
	var title = req.query.search;
	var options = {
		perPage: 10,
		page: page,
		criteria: {}
	};
	var ret = {
		topics: [],
		perPage: options.perPage,
		page: options.page,
		count: 0
	};

	if (title) {
		options.criteria.title = new RegExp(title, 'i');
		ret.search = title;
	}

  var listPromise = Topic.list(options);
	var countPromise = Topic.count(options.criteria).exec();
	listPromise.then(function(topics) {
		topics.forEach(function(topic) {
			topic = topic.toJSON();
			topic.comments = topic.comments.length;
			topic.likes = topic.likes.length;
			topic.votes = topic.votes.length;
			ret.topics.push(topic);
		});
		return countPromise;
	}).then(function(count) {
		ret.count = count;
		res.send(ret);
	}, function(err) {
		console.log(err);
		res.send(500);
	});
}
/*
 * Topic hot
 */
exports.hot = function(req, res) {
	Topic.hot(function(err, topics) {
		if (err) res.send(500);
		var ret = [];

		topics.forEach(function(topic) {
			topic = topic.toJSON();
			topic.comments = topic.comments.length;
			topic.likes = topic.likes.length;
			topic.votes = topic.votes.length;
			ret.push(topic);
		});

		res.send(ret);
	});
}
/*
 * Topic create
 * 1. Topic create
 * 2. User's score, topics data update
 */
exports.create = function(req, res) {
	var topic = new Topic(req.body);
	var uid = req.session.user.id;

	topic.on('save', function(topic) {
		var update = {
			$inc: { score: 20 , topicCount: 1 }
		};
		User.findByIdAndUpdate(uid, update).exec();
	});
	topic.user = uid;
	topic.save(function(err) {
		if (err) return res.send(err);
		res.send(topic);
	});
}

/*
 * Topic deatil action
 */
exports.detail = function(req, res) {
	var tid = req.params.tid;
	var update = {
		$inc: { views: 1 }
	};
	var user = req.session.user;

	Topic
	.load(tid)
	.then(function(topic) {
		topic.views += 1;
		var ret = topic.toJSON();
		var isLike = user && ~ret.likes.indexOf(user.id);
		var isVote = user && ~ret.votes.indexOf(user.id);

		if (isLike) {
			ret.isLike = true;
		} else {
			ret.isLike = false;
		}
		if (isVote) {
			ret.isVote = true;
		} else {
			ret.isVote = false;
		}
		ret.likes = ret.likes.length;
		ret.votes = ret.votes.length;
		res.send(ret);
		//View + 1
		topic.save();
	}, function(err) {
		res.send(500);
	});

}

/**
 * Update topic
 * 1. Topic add or remove user like
 * 2. Topic add or remove user vote
 * 3. Update User likes or votes
 */
exports.update = function(req, res) {
	var body = req.body;
	var tid = req.params.tid;
	var uid = req.session.user.id;
	var updateTopic = {};
	var userUpdate = {};
	var action;

	if (typeof body.isLike !== 'undefined') {
		if (body.isLike) {
			updateTopic = {
				$addToSet: { likes: uid }
			};
			userUpdate = {
				$inc: { likeCount: 1 }
			};
		} else {
			updateTopic = {
				$pull: { likes: uid }
			};
			userUpdate = {
				$inc: { likeCount: -1 }
			};
		}
		action = 'like';
	} else if (body.isVote !== 'undefined') {
		if (body.isVote) {
			updateTopic = {
				$addToSet: { votes: uid }
			};
		} else {
			updateTopic = {
				$pull: { votes: uid }
			};
		}
		action = 'vote';
	}
	var topicPromise = Topic.findByIdAndUpdate(tid, updateTopic).exec();
	topicPromise.then(function(topic) {
		if (action == 'like') {
			res.send({
				likes: topic.likes.length
			});
			User.findByIdAndUpdate(uid, userUpdate).exec();
		} else if (action = 'vote') {
			res.send({
				votes: topic.votes.length
			});
		} else {
			res.send(null);
		}
	}, function(err) {
		res.send(500);
	});
}