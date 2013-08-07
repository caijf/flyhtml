var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
/*var util = require('util');
mongoose.connect('localhost', 'mongoose');
function d(obj) {
  console.log(util.inspect(obj, { 
    showHidden: true, 
    depth: 3,
    colors: true 
  }));
}*/

/*
 * follow
 * replyYouTopic
 * replyYou
 * at
 */
var messageSchme = new Schema({
  type: { type: String, enum: ['follow', 'replyYourTopic', 'replyYou', 'at'] },
  createAt: { type: Date, default: Date.now },
  hasRead: { type: Boolean, default: false },
  master: { type: ObjectId, ref: 'User', required: true },
  topic: { type: ObjectId, ref: 'Topic' }
});

mongoose.model('Message', messageSchme);