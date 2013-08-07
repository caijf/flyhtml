define([
	'backbone',
], function(Backbone) {
	var TopicModel = Backbone.Model.extend({
		urlRoot: '/pjax/topics',
		initialize: function(options) {
			this.validators = {
				title: function(val) {
					if (val.length < 10 || val.length > 100) {
						return 'Title validate error';
					}
				}
			};
		},
		parse: function(res, options) {
			if (res.comments) {
				var commentsCollection = new Backbone.Collection(res.comments);
				commentsCollection.url = '/pjax/topics/' + res.id + '/comments';
				res.comments = commentsCollection;
			}
			return res;
		},
		toggleLike: function() {
			this.save({
				isLike: !this.get('isLike')
			}, {
				patch: true
			});
		},
		toggleVote: function() {
			this.save({
				isVote: !this.get('isVote')
			}, {
				patch: true
			});
		}
	});
	return TopicModel;
});