define(['backbone'], function(Backbone) {
	var UserModel = Backbone.Model.extend({
		urlRoot: '/pjax/users',
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
		initialize: function() {
			var self = this;
			this.validators = {
				username: function(val) {
					if (!val) {
						return 'Please enter your username';
					} else if (val.length < 5) {
						return 'Your username is too short';
					} else if (!/^\w{5,15}$/.test(val)) {
						return 'Username only include numbers and letters';
					} else if (val != self.get('username')) {
						// Check attribute uniqueness
						$.getJSON('/user/check?username=' + val).done(function(res) {
							if (res.error) {
								self.trigger('invalid', self, { username: 'Your username is already exist' });
							} else {
							}
						});
					}
				},
				email: function(val) {
					if (!val) {
						return 'Please enter your email';
					} else if (!/^[0-9a-z_][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}\.){1,4}[a-z]{2,4}$/.test(val)) {
						return 'Please enter a valid email address';
					} else if (val != self.get('email')) {
						$.getJSON('/user/check?email=' + val).done(function(res) {
							if (res.error) {
								self.trigger('invalid', self, { email: 'Your email is already exist' });
							} else {
							}
						});
					}
				},
				password: function(val) {
					if (!val) {
						return 'Please enter your password';
					} else if (val.length < 5) {
						return 'Your password is too short';
					} else if (!/^[a-zA-Z0-9~!@#$%^&*]{6,16}$/.test(val)) {
						return 'Please enter a valid password';
					}
				}
			};
		},
		validateItem: function(key, val) {
			return this.validators[key] ? this.validators[key](val) : false;
		}
	});
	return UserModel;
});