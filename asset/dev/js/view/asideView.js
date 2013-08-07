define([
	'backbone',
	'text!template/aside.html',
	'util'
],function(Backbone, asideTemplate, util) {
	//Common aside
	var AsideView = Backbone.View.extend({
		className: 'common-aside',
		events: {
			'submit form': 'search'
		},
		initialize: function() {
			this.render();
		},
		render: function() {
			var self = this;

			util.cachedAjax('/aside').done(function(res) {
				var template = _.template(asideTemplate, res);
				
				self.$el.html(template);
			});
		},
		search: function(e) {
			e.preventDefault();
			var el = this.$('.js-search');
			var val = $.trim(el.val());

			if (val) {
				Backbone.history.navigate('/topics/search/' + val, true);
				el.val('');
			}
		}
	});

	return AsideView;
});