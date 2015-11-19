/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;

// custom libraries
var sut = require("../lib/initwaterfall.js");

describe("Parse Test", function(){

	it("Returns correctly formatted array of Json objects", function (done) {		
		this.timeout(9000);

		var config = require('../data/test/config/config.parse.test.1.json');

		sut.parse(config,"US.zip","",function(error, results){
			assert(Array.isArray(results),'result is array'),
			done();
		});
		
	});
});	
