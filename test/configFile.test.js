/*jslint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var _und = require('underscore');
var customError = require('../lib/error.js');
var path = require("path");
//var path = require("path");

var filesExist = [
	'../data/test/config/configLoadEmpty.fail.json',
	'../data/test/config/configLoadNoCountry.fail.json'
];

var filesDontExist =[
	'../data/ABCEFD.txt',	
	'../data/QWERQWERQWERQWER.txt',	
];


var testFailConfigFiles = [
	'notARealtest.json',
	//'../data/test/config/configLoadEmpty.fail.json',
	//'../data/test/config/configLoadNoCountry.fail.json',
	//'../data/test/config/configLoadEmptyCountry.fail.json',	
	//'../data/test/config/configLoadNoDataUrl.fail.json',
	//'../data/test/config/configLoadEmpty.fail.json'
	
];

var testSuccessConfigFiles = [
	//'../data/test/config/configLoadSuccess.success.json'
];

// custom libraries
var suv = require("../lib/initwaterfall.js");

function _filesExist(configFile){
	
	describe("_fileExist", function(){
	
		it("success - file does exist: " + configFile, function (done) {
			this.timeout(10000);
			
			suv.doesFileExist(configFile, function (error, results) {
				
				//console.log(error);
				//console.log(results);
				
				if (error==null){
					assert.equal(results,true);
					done();
				} else {
					done();
				}
			});
		});
	});
};

function _filesDontExist(configFile){

	describe("_filesDontExist", function(){		
		
		it("failure - file does NOT exist: " + configFile, function (done) {
			this.timeout(10000);
			
			suv.doesFileExist(configFile, function (error, results) {

				
				if (error==null){
					done();
				} else {
					assert(error.message);  
					assert(error instanceof customError.FileNotFound);  
					assert(error instanceof Error); 
					done();
				}
			});
		});
		
	});

};

function _testFailures(configFile){
	describe("Latlong Init", function(){
	
		it("F1.Load empty configfile via callback " + configFile, function (done) {
			this.timeout(10000);
			
			suv.configFileCheck(configFile, function (error, results) {
				
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
			this.timeout(10000);
			
			suv.configFileCheck(configFile)
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
			this.timeout(10000);
			
			var fullPath = path.join()
			
			suv.configFileCheck(configFile, function (error, results) {

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
			this.timeout(10000);
			
			suv.configFileCheck(configFile)
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
_und.each(filesExist, function(item) {
	var newPath = path.join(__dirname, item);	
  	_filesExist(newPath);
});

_und.each(filesDontExist, function(item) {
	var newPath = path.join(__dirname, item);	
  	_filesDontExist(newPath);
});
/*
_und.each(testFailConfigFiles, function(item) {
  _testFailures(item);
});

_und.each(testSuccessConfigFiles, function(item) {
  _testSuccesses(item);
});
*/