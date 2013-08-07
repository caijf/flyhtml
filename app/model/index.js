var mongoose = require('mongoose');
var config = require('../../var/config');

mongoose.set('debug', true);
// bootstrap db
mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('%s db connect error', config.db);
	}
});

//load model
require('./user');
require('./topic');
require('./message');

module.exports = {
	User: mongoose.model('User'),
	Topic: mongoose.model('Topic'),
	Message: mongoose.model('Message')
};