define([
	'backbone',
	'model/TopicModel',
	'model/session',
	'text!template/topicDetail.html',
	'util'
], function(Backbone, TopicModel, session, topicDetailTemplate, util) {
	var temp = util.template(topicDetailTemplate);

	var BodyView = Backbone.View.extend({
		template: _.template(temp.item('body-template')),
		events: {
			'click .js-back': 'backList'
		},
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		backList: function() {
			history.back();
		}
	});

	var sideView = Backbone.View.extend({
		template: _.template(temp.item('side-template')),
		events: {
			'click .js-vote': 'toggleVote',
			'click .js-like': 'toggleLike'
		},
		initialize: function() {
			this.model.on('change:votes', this.render, this);
			this.model.on('change:likes', this.render, this);
			this.render();
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		toggleLike: function() {
			if (session.auth()) {
				this.model.toggleLike();
			}
		},
		toggleVote: function() {
			if (session.auth()) {
				this.model.toggleVote();
			}
		}
	});

	var CommentView = Backbone.View.extend({
		template: _.template(temp.item('comment-template')),
		className: 'media comment',
		events: {
			'click .js-reply': 'reply',
			'click .js-delete': 'delete',
		},
		initialize: function() {
			this.model.on('destroy', this.removeAnimate, this);
		},
		render: function() {
			var model = this.model.toJSON();

			if (model.user.id === session.id) {
				model['isDelete'] = true;
			} else {
				model['isDelete'] = false;
			}
			this.$el.html(this.template(model));
			return this.el;
		},
		reply: function() {
			if (!session.auth()) return;
			var el = $('.js-comment-text');
			var val = el.val();

			el.val(val + (val ? '\n' : '') + '@' + this.model.get('user').username + ' ').focus();
		},
		removeAnimate: function() {
			this.$el.fadeOut(300, _.bind(this.remove, this));
		},
		delete: function() {
			this.model.destroy().done(function() {
				util.alert.done('Comment delete successfully');
			});
		}
	});

	var CommentListView = Backbone.View.extend({
		events: {
			'click .js-comment': 'addComment'
		},
		initialize: function() {
			this.$list = this.$('.comments-list')
			this.collection.on('add', this.addOne, this);
			this.render();
		},
		render: function() {
			this.collection.forEach(this.addOne, this);
			if (session.isGuest()) {
				this.$el.append(temp.item('alert-login-template'));
			} else {
				this.$el.append(_.template(temp.item('comment-form-template'), session.toJSON()));
			}
		},
		addOne: function(model) {
			this.$list.append(new CommentView({
				model: model
			}).render());
		},
		addComment: function() {
			util.alert.load('Sending');
			var text = this.$('[name=comment-text]');

			//Add comment
			this.collection.create({
				body: $.trim(text.val())
			}, {
				wait: true,
				success: function() {
					util.alert.hide();
				}
			});
			text.val('');
		}
	});

	var TopicDetailView = Backbone.View.extend({
		el: $('#main'),
		initialize: function(options) {
			this.model = new TopicModel(options);
			this.model.on('sync', this.render, this);
			this.model.fetch();
		},
		render: function() {
			this.$el.html(temp.item('layout-template'));
			var model = this.model;


			//Render body view
			new BodyView({
				el: this.$('.topic-body'),
				model: model
			});

			//Render side view
			new sideView({
				el: this.$('.aside'),
				model: model
			});

			//Render comment view
			new CommentListView({
				el: this.$('.comments'),
				collection: model.get('comments')
			});

			$(document).scrollTop(0);
		}
	});
	return TopicDetailView;
});