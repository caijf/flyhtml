module.exports = function(grunt) {
  //grunt plugins
  require('load-grunt-tasks')(grunt);

  //Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      development: {
        files: ['app.js', 'app/**/*.js'],
        tasks: ['develop:development'],
        options: { nospawn: false }
      },
      production: {
        files: ['app.js', 'app/**/*.js'],
        tasks: ['develop:production'],
        options: { nospawn: false }
      }
    },
    develop: {
      //Auto restart application
      development: {
        file: 'app.js',
        env: { NODE_ENV: 'development' }
      },
      production: {
        file: 'app.js',
        env: { NODE_ENV: 'production' }
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'asset/dev',
        src: '**',
        dest: 'asset/dest'
      }
    },
    cssmin: {
      compile: {
        expand: true,
        cwd: 'asset/dev',
        src: ['**/*.css', '**/!*.min.css'],
        dest: 'asset/dest'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "asset/dev/js",
          dir: "asset/dest/js",
          modules: [
            {
              name: 'main'
            }
          ],
          shim: {
            jquery: {
              exports: '$'
            },
            underscore: {
              exports: '_'
            }
          },
          paths: {
            jquery: '../lib/jquery',
            underscore: '../lib/underscore',
            backbone: '../lib/backbone',
            text: '../lib/text',
            markdown: '../lib/markdown'
          }
        }
      }
    }   
  });

  //All tasks
  grunt.registerTask('build', ['copy', 'cssmin', 'requirejs']);

  grunt.registerTask('app', function(env) {
    var spawn = require('child_process').spawn;

    env = env || 'development';
    //Start app
    var start = spawn('node', ['app.js'], {
      env: env
    });
    start.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });
    start.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    if (env == 'development') {
      grunt.task.run(['watch:development']);
    } else {
      grunt.task.run(['watch:production']);
    }
  });
}