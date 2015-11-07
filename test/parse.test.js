/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;

// custom libraries
var sut = require("../lib/initwaterfall.js");

var config = require('../data/test/config/configLoadSuccess.success.json');


describe("Parse Test", function(){

	it("Returns correctly formatted array", function (done) {		
		this.timeout(5000);
		sut.parse(config,"US.zip","",function(error, results){
			console.log(results);
			done();
		});
		
	});
});	
