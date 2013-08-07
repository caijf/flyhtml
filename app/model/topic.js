var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var formatDate = require('../../lib/util').formatDate;


/*
 * topicSchema
 */
var topicSchema = new Schema({
  title: { type: String, required: true, default: '' },
  body: { type: String, default: '' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  tags: { type: [] },
  comments: [{
    body: { type: String, default: '' },
    createAt: { type: Date, default: Date.now },
    user: { type: ObjectId, ref: 'User', required: true }
  }],
  user: { type: ObjectId, ref: 'User', required: true },
  likes: [{ type: ObjectId, ref: 'User' }],
  votes: [{ type: ObjectId, ref: 'User' }]
});

topicSchema.path('title').validate(function(val) {
  return val.length >= 10 && val.length <= 100
}, 'title length must between 10 to 100');

/*
 * Beautiful date in order to show
 */
topicSchema.path('createAt').get(function(val) {
  return formatDate(val);
});
topicSchema.path('comments').schema.path('createAt').get(function(val) {
  return formatDate(val);
});

topicSchema.set('toJSON', {
    getters: true
});

/*
 * Static function
 */
topicSchema.static({
  list: function(options) {
    var criteria = options.criteria || {};
    var promise =  this
      .find(criteria)
      .select('-__v -body -updateAt')
      .sort({'createAt': -1 })
      .limit(options.perPage)
      .skip(options.perPage * (options.page - 1))
      .populate('user', 'username avatar').exec();
    return promise;
  },
  hot: function() {
    var promise = this
      .find()
      .select('-__v -body -updateAt')
      .sort({ views: -1 })
      .limit(5)
      .populate('user', 'username avatar')
      .exec();
    return promise;
  },
  load: function(id) {
    var field = 'username avatar';
    var author = field + ' topicCount likeCount';
    var promise = this
      .findById(id)
      .populate({ path: 'user', select: author })
      .populate({ path: 'comments.user', select: field })
      .exec();
    return promise;
  }
});

topicSchema.method({
  load: function(cb) {
    var field = 'username avatar';
    var author = field + ' topicCount likeCount';

    this.populate({ path: 'user', select: author  })
      .populate({ path: 'comments.user', select: field }, cb);
  },
  loadComments: function(cb) {
    var field = 'username avatar';
    this.populate({ path: 'comments.user', select: field }, cb);
  }
});

mongoose.model('Topic', topicSchema);