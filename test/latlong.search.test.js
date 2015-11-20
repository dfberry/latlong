/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;
//var path = require("path");

// custom libraries
var latlong = require("../latlong.waterfall.js");

// globals
var configFile = require('../data/test/config/configLoadSuccess.success.json');

/*

DFB: adding more time as the mongo db seems to be a bit slow

*/
describe("Latlong Search", function(){

	it(".ByTerm via callback", function (done) {
		this.timeout(20000);
		
		var searchTerm	= 'FIELD5';
		var searchValue = 'WA';
		
		latlong.Search.ByTerm(configFile.mongodb, searchTerm, searchValue, function (err, results) {
			assert.equal(err,null);
			assert.equal(results.length,747);
			done();
		});
	});
	it(".ByTerm via promise", function (done) {
		this.timeout(20000);
		
		var searchTerm	= 'FIELD5';
		var searchValue = 'WA';

		latlong.Search.ByTerm(configFile.mongodb, searchTerm, searchValue)
		.then(function (results) {
			assert.equal(results.length,747);
			done();
		})
		.fail(function(error){			
			assert.fail(error);
			done();
		});
	});
	it(".Fields via callback", function (done) {
		this.timeout(20000);
		latlong.Search.Fields(configFile.mongodb, function (err, results) {
			assert.equal(err,null);
			assert.equal(results.length,1);
			done();
		});
	});
	it(".Fields via promise", function (done) {
		this.timeout(20000);
		latlong.Search.Fields(configFile.mongodb)
		.then(function (results) {
			assert.equal(results.length,1);
			done();
		});
	});	
});	