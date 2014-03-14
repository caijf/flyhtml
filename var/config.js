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
    db: 'postgres://cdviqihbbqdnaa:jblB5ChLYlr_yAWDK6YXKn38K2@ec2-23-21-170-57.compute-1.amazonaws.com:5432/d5uff0l769dsum'
  }
}
for(var i in common) {
	obj.development[i] = common[i];
	obj.production[i] = common[i];
}

module.exports = obj[env];