define([
	'backbone', 
	'text!template/signup.html',
	'model/UserModel'
], function(Backbone, signupTemplate, UserModel) {
	var SignupView = Backbone.View.extend({
		className: 'modal-dialog modal-signup',
		events: {
			'click .js-create': 'create',
			'blur input': 'setVal',
			'submit form': 'create'
		},
		initialize: function() {
			this.model = new UserModel;
			this.model.on('invalid', this.inputFail, this);
			this.model.on('change', this.inputSucc, this);
		},
		render: function() {
			this.$el.html(signupTemplate);
			this.inputTemplate = this.$('#input-msg-template').html();
			return this.el;
		},
		inputFail: function(model, error) {
			for (var i in error) {
				this.$('[name=' + i +']').siblings('.help-inline')
					.html(_.template(this.inputTemplate, {
						error: error[i]
				}));
			}
		},
		inputSucc: function(model, current) {
			for (var i in model.changed) {
				this.$('[name=' + i +']').siblings('.help-inline')
					.html(_.template(this.inputTemplate, {
						error: ''
				}));
			}
		},
		setVal: function(e) {
			var tar = $(e.target);
			var name = tar.attr('name');
			var attr = {};

			attr[name] = $.trim(tar.val());
			this.model.set(attr, {
				validate: true
			});
		},
		create: function(e) {
			e.preventDefault();
			this.$('input').trigger('blur');
			if (!this.$('.text-danger').length) {
				this.model.save().done(_.bind(this.signupSuccess, this));
			}
		},
		signupSuccess: function(model, res) {
			this.$('.modal-body').html($('#signup-success-template').html());
			this.$('.modal-footer').remove();
		}
	});
	return SignupView;
});