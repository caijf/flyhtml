module.exports = function(grunt) {
	grunt.initConfig({
		requirejs: {
			compile: {
		    options: {
		      baseUrl: "asset/dev/js",
		      mainConfigFile: "asset/dev/js/main.js",
		      out: "asset/pro/js",
		      modules: [],
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
				    util: ['jquery'],
				    markdown: {
				      exports: 'markdown'
				    }
		      }
		    }
		  }
		}
	});
	// Load the plugin
 // grunt.loadNpmTasks('grunt-jsbeautifier');
  //grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task(s).
  grunt.registerTask('default', ['requirejs']);
}