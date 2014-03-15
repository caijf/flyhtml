var env = process.env.NODE_ENV || 'development';
/* common attribute */
var common = {
	avatar: 'http://www.gravatar.com/avatar/',
	commentDepth: 5
}
var obj = {
	development: {
		db: 'mongodb://localhost/app' 
	},
	production: {
		//mongodb://username:password@host:port/database?options...
    db: 'mongodb://nothing:nothing@oceanic.mongohq.com:10029/flyhtml'
  }
}
for(var i in common) {
	obj.development[i] = common[i];
	obj.production[i] = common[i];
}

module.exports = obj[env];