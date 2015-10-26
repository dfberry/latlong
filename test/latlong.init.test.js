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
	
		it(".Load empty configfile via callback " + configFile, function (done) {
			this.timeout(5000);
			
			latlong.Init.Load(configFile, function (error, results) {
				if (error){
					assert(error.message);  
					assert(error instanceof customError.BadConfig);  
					assert(error instanceof Error);  
					done();
				} else {
					assert.fail();
					done();
				}
			});
		});
		it(".Load empty configfile via promise " + configFile, function (done) {
			this.timeout(5000);
			
			latlong.Init.Load(configFile)
			.then(function (results) {
				assert.fail();
				done();
			})
			.fail(function(error){			
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
	
		it(".Load successful configfile via callback " + configFile, function (done) {
			this.timeout(5000);
			
			latlong.Init.Load(configFile, function (error, results) {

				if (results){
					assert.equal(true, results);
					done();
				} else {
					assert.fail(); 
					done();
				}
			});
		});
		it(".Load successful configfile via promise " + configFile, function (done) {
			this.timeout(5000);
			
			latlong.Init.Load(configFile)
			.then(function (results) {
				assert.equal(true, results);
				done();
			})
			.fail(function(error){	
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