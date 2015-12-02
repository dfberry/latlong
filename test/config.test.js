/*jslint node: true */

// 3rd party libraries
var chai = require("chai");
var assert = chai.assert;
var expect= require("chai").expect;

var _und = require('underscore');
var customError = require('../lib/error.js');
var myIOUtils = require('../lib/io-utils.js');
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
	'../data/test/config/configLoadNoCountry.fail.json',
	'../data/test/config/configLoadEmptyCountry.fail.json',	
	'../data/test/config/configLoadNoDataUrl.fail.json',
	'../data/test/config/configLoadEmpty.fail.json'
	
];

var testSuccessConfigFiles = [
	'../data/test/config/configLoadSuccess.success.json'
];

/*

DFB: todo - have the it functions run through array instead of separate topside function
so that test results display nicely

*/

// custom libraries
var SUT = require("../lib/config.js");

// DFB:Todo - check for exact errors
describe("Config file", function(){

	it("Empty config object", function (done) {
		this.timeout(10000);
		
		var configFile = undefined;
		
		SUT.FileCheck(configFile, function (error, results) {
			expect(error).to.exist;
			done();
		});
	});
	
	it("number", function (done) {
		this.timeout(10000);
		
		var configFile = 5;
		
		SUT.FileCheck(configFile, function (error, results) {
			expect(error).to.exist;
			done();
		});
	});
	it("string", function (done) {
		this.timeout(10000);
		
		var configFile = "this is a test";
		
		SUT.FileCheck(configFile, function (error, results) {
			expect(error).to.exist;
			done();
		});
	});	
});

function _filesExist(configFile){
	
	describe("_fileExist", function(){
	
		it("File: " + configFile, function (done) {
			this.timeout(10000);

			assert.doesNotThrow(function() {
				
				myIOUtils.doesFileExist(configFile, function (error, results) {
								
					if (error==null){
						assert.equal(results,true);
						done();
					} 
				}, function(err) {
					if (err) throw err; // will fail the assert.doesNotThrow
					done(); // call "done()" the parameter
				});				

			});
			
		});
	});
};

function _filesDontExist(configFile){

	describe("_filesDontExist", function(){		
		
		it("File: " + configFile, function (done) {
			this.timeout(10000);
				
			assert.doesNotThrow(function() {
				
				myIOUtils.doesFileExist(configFile, function (error, results) {
					if (error==null){
						
						// expect no Error, but a false response
						assert.equal(results,false);
						done();
					} 
				}, function(err) {
					if (err) throw err; // will fail the assert.doesNotThrow
					done(); // call "done()" the parameter
				});				
			});
		});
	});
};

function _testFailures(configFile){
	describe("configFileCheck failure", function(){
	
		it("File: " + configFile, function (done) {
			this.timeout(10000);
			
			SUT.FileCheck(configFile, function (error, results) {
				expect(error).to.exist;
				done();
			});
		});
	});
};

function _testSuccesses(configFile){

	describe("configFileCheck success", function(){
	
		it("File: " + configFile, function (done) {
			this.timeout(10000);
			
			//need to open file and add security settings
			var testconfig = require(configFile);
			var secureConfig = require("../data/test/config/config.secure.json");

			/* 
			need to add url, user, and pwd to mongodb json object
			*/
			testconfig.datastore.config.mongodb.url = secureConfig.mongodb.url;
			testconfig.datastore.config.mongodb.user = secureConfig.mongodb.user;
			testconfig.datastore.config.mongodb.pwd = secureConfig.mongodb.pwd;
			
			
			SUT.FileCheck(testconfig, function (error, results) {
				expect(results).to.exist;
				expect(error).to.be.null;
				done();
			});
		});
	});
}


//loop through files

_und.each(filesExist, function(item) {
	var newPath = path.join(__dirname, item);	
  	_filesExist(newPath);
});

_und.each(filesDontExist, function(item) {
	var newPath = path.join(__dirname, item);	
  	_filesDontExist(newPath);
});

_und.each(testFailConfigFiles, function(item) {
	var newPath = path.join(__dirname, item);
  _testFailures(newPath);
});

_und.each(testSuccessConfigFiles, function(item) {
	var newPath = path.join(__dirname, item);	
 	_testSuccesses(newPath);
});