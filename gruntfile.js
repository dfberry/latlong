module.exports = function(grunt) {

  grunt.initConfig({
    mocha: {
      test: {
        src: ['test/file/'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha');
  
  grunt.registerTask('default', ['mocha'])

};