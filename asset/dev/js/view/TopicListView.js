define([
	'backbone',
	'collection/TopicCollection',
	'text!template/topicList.html',
	'view/asideView',
	'util'
], function(Backbone, TopicCollection, topicListTemplate, asideView, util) {
	var temp = util.template(topicListTemplate);

	var TopicItemView = Backbone.View.extend({
		className: 'list-group-item list-group-item-hover',
		template: _.template(temp.item('topic-item-template')),
		render: function() {
			var data = this.model.toJSON();

			this.$el.html(this.template(data));
			return this.el;
		}
	});

	var TopicListView = Backbone.View.extend({
		el: $('#main'),
		initialize: function(options) {
			this.collection = new TopicCollection;
			this.collection.on('sync', this.render, this);
			this.collection.fetch({
				data: options
			}).done(function() {
				util.alert.hide();
				$(document).scrollTop(0);
			});
		},
		render: function(collection, res) {
			this.$el.html(temp.item('layout-template'));

			var topics = this.$('.list-group');
			var url;

			if (this.options.search) {
				url = '/topics/search/' + res.search + '/p';
			} else {
				url = '/topics/p';
			}
			if (collection.length) {
				collection.forEach(function(model) {
					topics.append(new TopicItemView({
						model: model
					}).render());
				});
				util.paginator.render({
					count: res.count,
					page: res.page,
					url: url,
					perPage: res.perPage
				}).insertAfter(topics);
			} else if (this.options.search) {
				topics.html(_.template(temp.item('search-result-template'), {
					search: res.search
				}));
			}
			//Render aside, One minute cache
			new asideView({
				el: this.$('.aside')
			});
		}
	});

	return TopicListView;
});