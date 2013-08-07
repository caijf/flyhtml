define([
	'backbone',
	'model/session',
	'text!template/comment.html'
], function(Backbone, session, commentTemplate) {

	return CommentListView;
});