define([
	'model/session',
	'util',
	'view/LoginView',
	'view/SignupView'
], function(session, util, LoginView, SignupView) {
	var init = function() {
		var $body = $('body');
		$body.on('click', 'a[data-ajax]', function(e) {
 			e.preventDefault();
 			// Remeber history referrer
 			util.store.set('referrer', location.pathname);
 			Backbone.history.navigate($(this).attr('href'), true);
 		});
 		// User is login or not
 		if (session.isGuest()) {
			session.on('login', function() {
				util.modal.show(new LoginView().render());
			});
			session.on('signup', function() {
				util.modal.show(new SignupView().render());
			});
 			$body.on('click', '.js-login', function() {
	 			session.trigger('login');
	 		}).on('click', '.js-signup', function() {
	 			session.trigger('signup');
	 		});
 		} else {
 			$body.on('click', '.js-logout', function() {
 				session.logout();
 			});
 		}
 		// Global ajax error
 		$(document).ajaxError(function (e, xhr, options) {
 			var status = xhr.status;
 			switch (status) {
 				case 0:
 					util.alert.fail('The server is not responding or is not reachable, try again later');
 					break;
 				case 401: 
 					session.trigger('login');
 					break;
 				case 500:
 					util.alert.fail('Internal Server Error, you can try again later');
 					break;
 				default:
 					break;
 			}
		});
	};
	return init;
});