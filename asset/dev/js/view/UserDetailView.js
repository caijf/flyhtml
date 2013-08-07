define([
	'backbone',
	'text!template/userDetail.html',
	'text!template/topicListItem.html',
	'util'
], function(Backbone, userTemplate, topicListItemTemplate, util) {
	var UserDetailView = Backbone.View.extend({
		el: $('#main'),
		initialize: function(options) {
			util.cachedAjax('/pjax/users/' + options.username).done(_.bind(this.render, this));
		},
		render: function(res) {
			var fragment = this.options.fragment;

			this.model = res;
			this.$el.html(_.template(userTemplate, res));
			this.$topics = this.$('.topics');
			if (~fragment.indexOf('likes')) {
				this.likes(); //Render likes
			} else if (~fragment.indexOf('comments')) {
				this.comments();	//Render comments
			} else {
				this.topics();	//Render topics
			}
		},
		topics: function() {
			util.cachedAjax('/pjax/users/' + this.model.id + '/topics')
				.done(_.bind(this.renderList, this));
			this.select('topics');
		},
		likes: function() {
			util.cachedAjax('/pjax/users/' + this.model.id + '/likes')
				.done(_.bind(this.renderList, this));
			this.select('likes');
		},
		comments: function() {
			util.cachedAjax('/pjax/users/' + this.model.id + '/comments')
				.done(_.bind(this.renderList, this));
			this.select('comments');
		},
		select: function(name) {
			this.$('.nav .active').removeClass('active');
			this.$('.js-' + name).addClass('active');
		},
		renderList: function(res, status, jqXHR) {
			var ret;
			var l = res.length;
			var topics = this.$topics;

			if (l) {
				var temp = _.template(topicListItemTemplate);
				for (var i = 0; i < l; i++) {
					topics.append(temp(res[i]));
				}
			} else {
				ret = '<div class="alert alert-info">\
								No exist topics \
							</div>';
				topics.html(ret);
			}
			util.alert.hide();
		}
	});

	return UserDetailView;
});