define([
	'backbone',
	'collection/UserCollection',
	'text!template/userList.html',
	'view/asideView',
	'util'
], function(Backbone, UserCollection, userListTemplate, asideView, util) {
	var temp = util.template(userListTemplate);

	var UserItemView = Backbone.View.extend({
		tagName: 'a',
		template: _.template(temp.item('user-item-template')),
		className: 'list-group-item',
		render: function() {
			var model = this.model;

			this.$el.attr({
				'href': '/users/' + model.get('username'),
				'data-ajax': ''
			}).html(this.template(model.toJSON()));

			return this.el;
		}
	});

	var UserListView = Backbone.View.extend({
		el: $('#main'),
		initialize: function(options) {
			this.collection = new UserCollection;
			this.collection.on('sync', this.render, this);
			this.collection.fetch({
				data: options
			}).done(function() {
				util.alert.hide(1);
			});
		},
		render: function(collection, res) {
			this.$el.html(temp.item('layout-template'));
			this.$users = this.$('.list-group');
			this.collection.forEach(this.addOne, this);
			console.log(this.collection);
			util.paginator.render({
				count: res.count,
				page: res.page,
				url: '/users/p',
				perPage: res.perPage
			}).insertAfter(this.$users);

			//Render aside, One minute cache
			new asideView({
				el: this.$('.aside')
			});
		},	
		addOne: function(model) {
			this.$users.append(new UserItemView({
				model: model
			}).render());
		}
	});

	return UserListView;
});