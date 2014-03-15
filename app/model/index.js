var mongoose = require('mongoose');
var config = require('../../var/config');

function connectCb(err) {
  if (err) {
    console.error('%s db connect error', config.db);
  }
}

//mongoose.set('debug', true);
// bootstrap db


if (config.dbOpts) {
  mongoose.connect(config.db, config.dbOpts, connectCb);
} else {
  mongoose.connect(config.db, connectCb);
}

//load model
require('./user');
require('./topic');
require('./message');

module.exports = {
	User: mongoose.model('User'),
	Topic: mongoose.model('Topic'),
	Message: mongoose.model('Message')
};