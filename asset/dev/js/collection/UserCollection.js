define([
	'backbone'
], function(Backbone, TopicModel) {
	var TopicCollection = Backbone.Collection.extend({
		url: '/pjax/users',
		initialize: function() {
			
		},
		parse: function(res, options) {
			this.total = res['count'];
			return res['users'];
		}
	});
	return TopicCollection;
});