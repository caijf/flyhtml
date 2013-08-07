define([
	'backbone',
	'model/TopicModel'
], function(Backbone, TopicModel) {
	var TopicCollection = Backbone.Collection.extend({
		url: '/pjax/topics',
		initialize: function() {
			
		},
		parse: function(res, options) {
			this.total = res['count'];
			return res['topics'];
		}
	});
	return TopicCollection;
});