/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var fs = require("fs");

// custom libraries
var sut = require("../lib/initwaterfall.js");

describe("Parse", function(){

	it("Convert tab-delimited to json", function (done) {		
		this.timeout(30000);

		var config = require('../data/test/config/config.parse.test.1.json');

		// act
		sut.parse(config,"US.zip","",function(error, results){
			
			// assert
			assert(Array.isArray(results),'result is array');
			assert.equal(43633, results.length);
			done();
		});
		
	});
});	
