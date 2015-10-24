/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var path = require("path");

// custom libraries
var testInitLibrary = require("../latlong.js").Init;

// globals
var configFile = '';//../data/test/config/config1.json';

describe("Main library entry point", function(){

	it("via callback", function (done) {
		this.timeout(5000);
		var final = path.join(__dirname, testInitLibrary);		
		testInitLibrary.Init(final, function (err, results) {
			console.log(results);
			assert.equal(err,null);
			assert.equal(results.length,null);
			
		});
		done();
	});
	it("via promise", function (done) {
		testInitLibrary.Init(tsvFile)
		.then(function (tsvJson) {
			assert.equal(tsvJson.length,43633);
			done();
		}, function(error) {
    		assert.fail(error);
    		done();
  		});

	});	
	
});	