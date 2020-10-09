module.exports = function (grunt) {
  // grunt config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        esversion: 6,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
        },
      },
      all: ['Gruntfile.js', 'src/js/**/*.js', '!src/js/lib/**/*.js'],
    },
    browserify: {
      options: {
        browserifyOptions: { debug: true },
        transform: [['babelify', { presets: ['@babel/preset-env'] }]],
      },
      all: {
        expand: true,
        cwd: 'src/js',
        src: ['**/*.js', '!**/*.babel.js', '!**/*.min.js', '!lib/**/*.js'],
        dest: 'src/js',
        ext: '.babel.js',
      },
    },
    terser: {
      all: {
        expand: true,
        cwd: 'src/js',
        src: ['**/*.babel.js', '!**/*.min.js', '!lib/**/*.js'],
        dest: 'dist/js',
        ext: '.min.js',
      },
    },
    cssmin: {
      all: {
        expand: true,
        cwd: 'src/css',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css',
        ext: '.min.css',
      },
    },
    clean: {
      babel: ['src/js/**/*.babel.js'],
    },
  });

  // jshint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // browserify
  grunt.loadNpmTasks('grunt-browserify');

  // minify js
  grunt.loadNpmTasks('grunt-terser');

  // minify css
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // clean
  grunt.loadNpmTasks('grunt-contrib-clean');

  // default tasks
  grunt.registerTask('default', ['jshint']);

  // release tasks
  grunt.registerTask('release', ['default', 'browserify', 'terser', 'cssmin', 'clean']);
};
