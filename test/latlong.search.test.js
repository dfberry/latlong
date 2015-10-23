/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var path = require("path");

// custom libraries
var latlong = require("../latlong.js");

// globals
var configFile = require('../data/test/config/config1.json');
var searchTerm	= 'FIELD5';
var searchValue = 'WA';


describe("Latlong Search Test", function(){

	it("via callback", function (done) {
		this.timeout(5000);
		latlong.Search.ByTerm(configFile, searchTerm, searchValue, function (err, results) {
			assert.equal(err,null);
			assert.equal(results.length,747);
			done();
		});
	});
	it("via promise", function (done) {
		this.timeout(5000);
		latlong.Search.ByTerm(configFile, searchTerm, searchValue)
		.then(function (results) {
			assert.equal(results.length,747);
			done();
		})
		.fail(function(error){			
			assert.fail(error);
			done();
		});
	});	
	
});	