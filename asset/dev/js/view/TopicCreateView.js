define([
	'backbone',
	'model/TopicModel',
	'text!template/topicCreate.html',
	'markdown',
	'util'
], function(Backbone, TopicModel, topicCreateTemplate, markdown, util) {
	var TopicCreateView = Backbone.View.extend({
		el: $('#main'),
		events: {
			'click .js-preview': 'preview',
			'click .js-write': 'write',
			'submit form': 'create'
		},
		initialize: function() {
			this.model = new TopicModel();
			this.render();
		},
		render: function() {
			this.$el.html(topicCreateTemplate);
			this.$content = this.$('.js-content');
			this.$title = this.$('.js-title');
			this.$submit = this.$('[type=submit]');
			this.$title.keyup(_.bind(this.setTitle, this));
		},
		preview: function() {
			this.$('.js-preview-content').show().html(markdown.toHTML(this.$content.val()));
			this.$content.hide();
			this.select('.js-preview');
		},
		write: function() {
			this.$content.show();
			this.$('.js-preview-content').hide();
			this.select('.js-write');
		},
		select: function(selector) {
			this.$('.nav .active').removeClass('active');
			this.$(selector).addClass('active');
		},
		trim: function(el) {
			return $.trim(el.val());
		},
		setTitle: function() {
			var validate = this.model.set({
				title: this.trim(this.$title)
			}, {
				validate: true
			});
			if (validate) {
				this.$submit.removeAttr('disabled');
			} else {
				this.$submit.attr('disabled', 'disabled');
			}
		},
		create: function(e) {
			e.preventDefault();
			this.model.save({
				body: markdown.toHTML(this.$content.val())
			}).done(function(res) {
				util.alert.done('Your topic has been create!');
				Backbone.history.navigate('/topics/' + res.id, true);
			});
		}
	});

	return TopicCreateView;
});