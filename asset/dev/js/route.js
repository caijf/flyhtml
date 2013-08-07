define([
	'backbone',
	'view/LeftMenuView',
	'view/TopMenuView',
	'view/TopicListView',
	'view/TopicDetailView',
	'view/TopicCreateView',
	'view/UserListView',
	'view/UserDetailView',
	'util'
], function(Backbone, LeftMenuView, TopMenuView, TopicListView, TopicDetailView, TopicCreateView, UserListView, UserDetailView, util) {
	//Backbone model extend
	_.extend(Backbone.Model.prototype, {
		validate: function(attrs, options) {
			var error = {};
			var msg;
			for (var i in attrs) {
				msg = this.validateItem(i, attrs[i]);
				if (msg) {
					error[i] = msg;
				}
			}
			// If validate has return msg, it will trigger "invalid" event
			return !_.isEmpty(error) && error;
		},
		validateItem: function(key, val) {
			this.validators = this.validators || {};
			return this.validators[key] ? this.validators[key](val) : false;
		}
	});

	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'topics',
			'topics': 'topics',
			'topics/p:page': 'topics',
			'topics/search/:text': 'search',
			'topics/search/:text/p:page': 'search',
			'topics/create': 'topicCreate',
			'topics/:id': 'topicDetail',
			'users': 'users',
			'users/p:page': 'users',
			'users/:username': 'user',
			'users/:username/likes': 'user',
			'users/:username/comments': 'user',
		},
		initialize: function() {
			this.topMenuView = new TopMenuView();
		},
		topics: function(page) {
			util.alert.load();
			page = page || 1;
			new TopicListView({
				page: page
			});
			this.topMenuView.select('.js-topics-link');
		},
		search: function(text, page) {
			page = page || 1;

			new TopicListView({
				search: text,
				page: page
			})
			this.topMenuView.select('.js-topics-link');
		},
		topicDetail: function(id) {
			new TopicDetailView({
				id: id
			});
			this.topMenuView.select('.js-topics-link');
		},
		topicCreate: function() {
			new TopicCreateView();
			this.topMenuView.select('.js-topics-link');
		},
		user: function(username) {
			new UserDetailView({
				username: username,
				fragment: Backbone.history.fragment
			});
			this.topMenuView.select('.js-users-link');
		},
		users: function(page) {
			util.alert.load();
			page = page || 1;
			new UserListView({
				page: page
			});
			this.topMenuView.select('.js-users-link');
		}
	});
	var route = function() {
		// Start app
		new AppRouter;

	 	// Use pushState
	 	Backbone.history.start({ pushState: true });
	};
	return route; 
});