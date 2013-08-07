var Topic = require('../model').Topic;
var User = require('../model').User;

/*
 * Add comment
 * 1. Add comment to topic
 * 2. Update user data
 */
exports.create = function(req, res) {
	// Unprocessable Entity
	if (!req.body.body) {
		return res.status(422).send({
			err: 'Content can\'t be blank'
		});
	} 
	var tid = req.params.tid;
	var uid = req.session.user.id;
	var comment = { 
		body: req.body.body, 
		user: uid 
	};
	var topicUpdate = {
		$push: { comments: comment }
	};
	var userUpdate = {
		$inc: { commentCount: 1, score: 5 },
	};
	var topicPromise = Topic.findByIdAndUpdate(tid, topicUpdate).exec();

	topicPromise.then(function(topic) {
		var ret = topic.toJSON().comments.pop();
		
		ret.user = req.session.user;
		res.send(ret);
		User.findByIdAndUpdate(uid, userUpdate).exec();
	}, function(err) {
		res.send(500);
	});
}
/*
 * Delete
 * 1. Remove comment from topic
 * 2. Update user data
 */
exports.remove = function(req, res) {
	var tid = req.params.tid;
	var cid = req.params.cid;
	var uid = req.session.user.id;
	var topicUpdate = {
		$pull: { comments: { _id: cid } }
	};
	var userUpdate = {
		$inc: { commentCount: -1, score: -5 },
	};
	var topicPromise = Topic.findByIdAndUpdate(tid, topicUpdate).exec();

	topicPromise.then(function() {
		res.send({ success: 'Delete successfully'});
		User.findByIdAndUpdate(uid, userUpdate).exec();
	}, function(err) {
		res.send(500);
	});
}

/*
 * Update
 */
exports.update = function(req, res) {
	// Unprocessable Entity
	if (!req.body.body) {
		return res.status(422).send({
			err: 'body can\'t be blank'
		});
	}
	var params = req.params;
	var criteria = {
		_id: params.tid,
		'comments._id': params.cid
	};
	var topicUpdate = {
		$set: { 'comments.$.body': req.body.body }
	};

	Topic.update(criteria, topicUpdate, function(err, topic) {
		if (err) res.send(500);
		res.send({})
	});
}