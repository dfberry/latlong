module.exports = function(grunt) {

  grunt.initConfig({
	  jasmine_node: {
		  options: {
			  showColors: true,
			  forceExit: true,
			  match: '.',
			  matchall: false,
			  extensions: 'js'
			  
		  },
		  all: ['spec/']
	  }   
  });

  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('test', ['jasmine_node']);

};