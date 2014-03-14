define([
	'backbone',
	'model/session', 
	'text!template/login.html'
], function(Backbone, session, loginTemplate) {
	var LoginView = Backbone.View.extend({
		className: 'modal-dialog',
		events: {
			'submit form': 'auth'
		},
		initialize: function() {
			session.on('invalid', this.loginError, this);
		},
		render: function() {
			this.$el.html(loginTemplate);
			return this.el;
		},
		auth: function(e) {
			e.preventDefault();

			session.login({
				username: this.getInputVal('username'),
				password: this.getInputVal('password'),
				remember: this.getInputVal('remember')
			});
		},
		loginError: function(model, error) {
			this.$('.alert').html(error).removeClass('hide');
		},
		getInputVal: function(name) {
			return $.trim(this.$('[name=' + name + ']').val());
		}
	});
	return LoginView;
});