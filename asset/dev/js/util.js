define(function() {
	//Modal constructor
	var Modal = function(element, options) {
		this.$backdrop = $('<div class="modal-backdrop fade in">');
		this.$modal = $('<div class="modal"></div>');
	};
	Modal.prototype = {
		show: function(el) {
			this.$modal.html(el).show().addClass('fade in');
			if (!this.isShown) {
				this.$backdrop.click($.proxy(this.hide, this))
					.appendTo(document.body);
				this.$modal.on('click', '.close', $.proxy(this.hide, this))
					.appendTo(document.body);
			}
			this.isShown = true;
		},
		hide: function() {
			this.$backdrop.remove();
			this.$modal.remove();
			this.isShown = false;
		}
	};


	var Paginator = function() {
		this.$el = $('<ul class="pagination pagination-large"></ul>');
	};
	Paginator.prototype = {
		render: function(options) {
			var ul = this.$el.html(''); 
			var pageCount = Math.ceil(options.count / options.perPage);
			
			for (var i = 1; i <= pageCount; i++) {
				var url = options.url + i;
				ul.append('<li' + (i == options.page ? ' class="active"' : '')  + '><a data-ajax href="'+ url +'">' + i + '</a></li>');
			}
			var first = ul.find('li:first a');
			first.attr('href', first.attr('href').replace('/p1',''));
			return this.$el;
		}
	};
	// Cookie ?
	var Store = function() {
		if (window.localStorage) {
			this.support = true;
		} else {
			this.support = false;
		}
	};
	Store.prototype = {
		get: function(item) {
			if (!this.support) return;
			return localStorage.getItem(item);
		},
		set: function(item, value) {
			if (!this.support) return;
			 localStorage.setItem(item, value);
		}
	};

	var creteCache = function() {
 		var cache = {};

 		//One minute clear cache
		setInterval(function() {
			cache = {};
		}, 1000 * 60);

	 	return function(url) {
	 		if (cache[url]) {
	 			return cache[url];
	 		}
	 		return cache[url] = $.get(url);
	 	}
	};

	var Template = function(str) {
		this.$el = $('<div>').html(str);
	};
	Template.prototype = {
		item: function(selector) {
			return this.$el.find('#' + selector).html();
		}
	};

	var MsgAlert = function() {
		this.$el = $('<div class="msg-alert"></div>');
		this.template = _.template('<span class="label label-<%= label %>"> \
											<i class="icon-<%= icon %>"></i><%= text %> \
										</span>');
	};
	MsgAlert.prototype = {
		done: function(text, time) {
			var obj = {
				text: text,
				label: 'success',
				icon: 'ok'
			}

			this.show(obj).css('top', 80);
			this._hide(time);
		},
		fail: function(text, time) {
			var obj = {
				text: text,
				label: 'danger',
				icon: 'remove'
			}

			this.show(obj).css('top', 80);
			this._hide(time || 5000);
		},
		load: function(text) {
			var obj = {
				text: text || 'loading...',
				label: 'info',
				icon: 'spinner icon-spin'
			}

			this.show(obj).css('top', 20);
		},
		hide: function() {
			this.$el.fadeOut(400);
		},
		_hide: function(time) {
			var el = this.$el;

			time = time || 3000;
			setTimeout(function() {
				el.fadeOut(400);
			}, time);
		},
		append: function() {
		  if (this.isShown) return;
		  this.$el.appendTo(document.body);
			this.isShown = true;
		},
		show: function(obj) {
			this.append();
			this.$el.html(this.template(obj)).show();
			return this.$el;
		}
	};
	
	var util = {
		modal: new Modal(),
		alert: new MsgAlert(),
		paginator: new Paginator(),
		store: new Store(),
		cachedAjax: creteCache(),

		template: function(str) {
			return new Template(str);
		}
	};

	return util;
});



