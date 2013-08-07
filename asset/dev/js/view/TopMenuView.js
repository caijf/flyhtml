define([
	'backbone',
	'model/session', 
	'text!template/topMenu.html'
], function(Backbone, session, topMenuTemplate) {
	var TopMenuView = Backbone.View.extend({
		el: $('#top-menu'),
		events: {
			'click .js-nav-primary a': 'setNav'
		},
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(_.template(topMenuTemplate, session.toJSON(), { variable: 'user' }));
			return this;
		},
		select: function(selector) {
			this.$('.js-nav-primary .active').removeClass('active');
			this.$(selector).addClass('active');
		}
	});
	return TopMenuView;
});