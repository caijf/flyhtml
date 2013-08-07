var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var ObjectId = Schema.ObjectId;
var config = require('../../var/config');

var userSchema = new Schema({
  username: { type: String, unique: true, index: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  avatar: String,
  gender: { type: String, enum: ['male', 'female'], default: 'male' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
  topicCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  aboutMe: { type: String, default: '' }
});

/* Validate */
userSchema.path('username').validate(function(val) {
  return /^\w{5,}$/.test(val);
}, 'Username must only include numbers and letters');

userSchema.path('email').validate(function(val) {
  return /^[0-9a-z_][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}\.){1,4}[a-z]{2,4}$/.test(val);
}, 'Invalid email');


userSchema.path('avatar').get(function(val) {
  return config.avatar + val;
});

/**
 * Pre-save hook
 */
userSchema.pre('save', function(next) {
  this.password = crypto.createHash('md5').update(this.password).digest('hex');
  this.avatar = crypto.createHash('md5').update(this.email).digest('hex');
  next();
});

userSchema.static({
  list: function(options) {
    return this.find()
      .sort({ score: -1 })
      .limit(options.perPage)
      .skip(options.perPage * (options.page - 1))
      .exec();
  },
  active: function() {
    return this.find()
      .select('username score avatar')
      .sort({ score: -1 })
      .limit(5)
      .exec();
  }
});

/**
 * Methods
 */
userSchema.method({
  authPassword: function(value) {
    return crypto.createHash('md5').update(value).digest('hex') === this.password;
  },
  loadTopics: function(cb) {
    var field = '';
    
    this.populate({ path: 'topics', select: field }, cb);
  },
  loadLikes: function() {

  },
  loadComments: function() {

  }
});

userSchema.set('toJSON', {
    getters: true
});

mongoose.model('User', userSchema);
