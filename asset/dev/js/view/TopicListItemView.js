define([
	'backbone',
	'text!template/topicListItem.html'
], function(Backbone, template) {
	var TopicListItemView = Backbone.View.extend({
		className: 'list-group-item list-group-item-hover',
		template: _.template(template),
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this.el;
		}
	});

	return TopicListItemView;
});