'use strict';

module.exports = function(grunt) {

  // Comment out any unused components
  var jsSrcFiles = [
    './latlong.js',
    'lib/*.js'
  ];
  
  var jsTestFiles = [
    'test/*.js'
  ];
  
  var jsMetaFiles = [
    './gruntfile.js'
  ];

  grunt.initConfig({
    
    
    mochaTest: {
      test: {
        src: ['test/*.js'],
      }
    },
    jshint: {
      // You get to make the name
      // The paths tell JSHint which files to validate
      myMetaFiles: [jsMetaFiles],
      mySrcFiles: [jsSrcFiles],
      myTestFiles: [jsTestFiles],
      options: {
        /*
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
        */
      }     
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
    
  grunt.registerTask('lint', ['jshint:mySrcFiles', 'jshint:myTestFiles']);
  grunt.registerTask('test', ['mochaTest']);
};