({
	baseUrl: "./",
	appDir: "./",
  dir: "../../pro/js",
  modules: [
  	{
  		name: 'main'
  	}
  ],
	shim: {
   	underscore: {
      exports: '_'
    },
    backbone: {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['underscore', 'jquery'],
      //Once loaded, use the global 'Backbone' as the
      exports: 'Backbone'
    },
    util: {
      deps: ['underscore', 'jquery'],
      exports: 'util'
    },
    markdown: {
      exports: 'markdown'
    }
	},
	paths: {
		jquery: '../lib/jquery',
		underscore: '../lib/underscore',
		backbone: '../lib/backbone',
		text: '../lib/text',
    markdown: '../lib/markdown'
	}
})