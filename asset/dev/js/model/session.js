define([
	'backbone',
], function(Backbone, LoginView, SignupView) {
	var SessionModel = Backbone.Model.extend({
		urlRoot: '/session',
		validate: function(attrs) {
			// Run validation against current attribute, if not valid
			// it will trigger 'invalid' event.
			if (!attrs.username) {
				return 'Please input your username';
			}
			if (!attrs.password) {
				return 'Please input your password';
			}
			//server response error or success
			return attrs.error;
		},
		login: function(attrs) {
			this.save(attrs, {
				success: this.refresh
			});
		},
		logout: function() {
			this.destroy({
				success: this.refresh
			});
		},
		isGuest: function() {
			return !this.get('username');
		},
		auth: function() {
			// if user is guest, trigger 'login' event
			if (this.isGuest()) {
				this.trigger('login');
				return false;
			} else {
				return true;
			}
		},
		refresh: function() {
			location.href = location.href;
		}
	});
	return new SessionModel(user);
});