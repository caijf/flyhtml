define([
	'backbone',
	'view/TopicListView',
	'view/UserListView',
	'view/AsideView'
], function(Backbone, TopicListView, UserListView, AsideView) {
	var IndexView = Backbone.View.extend({
		el: $('#main'),
		initialize: function() {
			this.$aside = $('<div class="aside">').appendTo(this.el);
			this.$content = $('<div class="content">').appendTo(this.el);
			this.asideRender();
		},
		topicListRender: function(options) {
			console.log(this.$content);
			options.el = this.$content;
			new TopicListView(options)
		},
		userListRender: function(options) {
			options.el = this.$content;
			new UserListView(options);
		},
		asideRender: function() {
			new AsideView({
				el: this.$aside
			});
		}
	});

	return IndexView;
});