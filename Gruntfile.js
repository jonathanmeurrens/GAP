var jspaths = [
  'src/js-dev/views/*.js',
  'src/js-dev/views/objects/*.js',
  'src/js-dev/views/parts/*.js',
  'src/js-dev/views/screens/*.js',
  'src/js-dev/managers/*.js',
  'src/js-dev/models/*.js',
  'src/js-dev/views/*.js',
  'src/js-dev/helpers/*.js',
  'src/js-dev/main.js'
];

var csspaths = ["src/sass/*.scss"];
var templatepaths = ["src/templates/*.hbs"];

var concatpaths = ['src/js/templates.js'].concat(jspaths);

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        banner: "(function(){\n\n",
        footer: "\n\n})();",
        separator: '\n\n'
      },
      dist: {
        src: concatpaths,
        dest: 'src/js/main.js'
      }
    },

    watch: {
      scripts:{
        files: jspaths,
        tasks: ['jshint','handlebars','concat','clean']
      },
      css:{
        files: csspaths,
        tasks:['compass:development']
      },
      handlebars:{
        files: templatepaths,
        tasks: ['handlebars','concat','clean']
      }
    },

    uglify: {
      default: {
        options: {
          wrap: true
        },
        files: {
          'out/js/main.js': concatpaths
        }
      }
    },

    compass: {
      development: { 
        options: {
          sassDir: 'src/sass',
          cssDir: 'src/css',
          environment: 'development'
        }
      },
      production: { 
        options: {
          sassDir: 'src/sass',
          cssDir: 'out/css',
          environment: 'production',
          outputStyle: 'compressed',
          force: true
        }
      }
    },

    copy: {
      production: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['index.html',
                'data/*',
                'assets/**/*',
                'js/vendor/*'],
            dest: 'out/'
          }
        ]
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: "tpl",
          processName: function(filePath) {
            var pieces = filePath.split("/");
            return pieces[pieces.length - 1].split(".")[0];
          },
          partialsUseNamespace: true
        },
        files: {
          "src/js/templates.js": templatepaths
        }
      }
    },

    jshint:{
      default:{
        options: {
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          noarg: true,
          sub: true,
          undef: true,
          eqnull: true,
          browser: true,
          noempty: true,
          trailing: true,
          globals:{
              $: true,
              console:true,
              Handlebars:true
          },
        },
        files:{
          src: jspaths
        }
      }
    },

    clean: ['src/js/templates.js']

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint','concat','compass:development','clean']);
  grunt.registerTask('production', ['jshint','uglify','compass:production','copy:production']);

};