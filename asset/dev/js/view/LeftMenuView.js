define([
	'backbone',
	'model/session',
	'text!template/leftMenu.html'
], function(Backbone, session, headerTemplate) {
	var HeaderView = Backbone.View.extend({
		el: $('#left-menu'),
		initialize: function() {
			//initialize user data
			// gobal user model
			this.render();
		},
		render: function() {
			this.$el.html(_.template(headerTemplate, session.toJSON(), { variable: 'user' }));
			return this;
		},
		select: function(selector) {
			this.$('.nav .active').removeClass('active');
			this.$(selector).addClass('active');
		}
		
	});
	return HeaderView;
});