/*jslint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var _und = require('underscore');
var customError = require('../lib/error.js');
//var path = require("path");

var testFailConfigFiles = [
	'../data/test/config/configLoadEmpty.fail.json',
	'../data/test/config/configLoadNoCountry.fail.json',
	'../data/test/config/configLoadEmptyCountry.fail.json',	
	'../data/test/config/configLoadNoDataUrl.fail.json',
	'../data/test/config/configLoadEmpty.fail.json'
	
];

var testSuccessConfigFiles = [
	'../data/test/config/configLoadSuccess.success.json'
];

// custom libraries
var latlong = require("../latlong.js");

function _testFailures(configFile){
	describe("Latlong Init", function(){
	
		it("F1.Load empty configfile via callback " + configFile, function (done) {
			this.timeout(5000);
			
			latlong.Init.Load(configFile, function (error, results) {
				
				//console.log(error);
				//console.log(results);
				
				if (error){
					console.log("error received");
					assert(error.message);  
					assert(error instanceof customError.BadConfig);  
					assert(error instanceof Error);  
					done();
				} else {
					console.log("no error received");
					assert.fail();
					done();
				}
			});
		});
		it("F2.Load empty configfile via promise " + configFile, function (done) {
			this.timeout(5000);
			
			latlong.Init.Load(configFile)
			.then(function (results) {
				assert.fail();
				done();
			})
			.fail(function(error){	
				console.log("error received");		
				assert(error.message);  
				assert(error instanceof customError.BadConfig);  
				assert(error instanceof Error);   
				done();
			});
		});
	});
};

function _testSuccesses(configFile){


	describe("Latlong Init", function(){
	
		it("S1.Load successful configfile via callback " + configFile, function (done) {
			this.timeout(5000);
			
			latlong.Init.Load(configFile, function (error, results) {

				if (error){
					console.log("error received");
					assert.fail(); 
					done();
				} else {
					assert.equal(true, results);
					done();
				}
			});
		});
		it("S2.Load successful configfile via promise " + configFile, function (done) {
			this.timeout(5000);
			
			latlong.Init.Load(configFile)
			.then(function (results) {
				assert.equal(true, results);
				done();
			})
			.fail(function(error){	
				console.log("error received");
				assert.fail(); 
				done();
			});
		});
	});
}


//loop through expected failure

_und.each(testFailConfigFiles, function(item) {
  _testFailures(item);
});

_und.each(testSuccessConfigFiles, function(item) {
  _testSuccesses(item);
});