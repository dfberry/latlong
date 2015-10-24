/*jslint node: true */
'use strict';

var exports = module.exports = {};

var Q = require("q");
var fs = require("fs");
var http = require('http');
var _und = require('underscore');
var process = require('process');
var customError = require("./error");

// get tsv file - need location and name of file or all files
// convert to json - save as json object in file
// insert into db - mongo takes json objects for insert
//So, in order to save, you need to convert your JSON array into an array/List of DBObjects, or save each array's item
// var jsons = s.map(JSON.stringify);

exports.Load = function Load(configObject, callback){
	
	// setup callback into promise
	var deferred = Q.defer();
	deferred.promise.nodeify(callback);
	
	getTsvFile(configObject)
		.then(function(response){
			deferred.resolve(true)
		})
		.fail(function(response){
			deferred.reject(response);
		});
	
	return deferred.promise;
};

var getTsvFile = function (configFile, callback) {
	
	// setup callback into promise
	var deferred = Q.defer();
	deferred.promise.nodeify(callback);

	var config = require(configFile);

	if(config===undefined){
		var errorConfigFile = new customError.BadConfig("configFile===undefined");
		deferred.reject(errorConfigFile);
		return deferred.promise;
	}
	
	if(config.dataurl===undefined){
		var errorDataUrl = new customError.BadConfig("configFile.dataurl===undefined");
		deferred.reject(errorDataUrl);
		return deferred.promise;
	}
	
	if(config.country===undefined){
		var errorcountry = new customError.BadConfig("configFile.country===undefined");
		deferred.reject(errorcountry);
		return deferred.promise;
	}
	
	if(config.datadirectory===undefined){
		var errordatadirectory = new customError.BadConfig("configFile.datadirectory===undefined");
		deferred.reject(errordatadirectory);
		return deferred.promise;
	}
	
	var dataurl = config.dataurl;
	var country = config.country;
	var datadirectory = config.datadirectory;

	_und.each(config.country, function(item) {
		download(config.dataurl + item, config.datadirectory + item + '.test', function(results){
			console.info(item + " Execution time (hr): %ds %dms", results[0], results[1]/1000000);
		});
	});

	
	deferred.resolve(true);
	
	return deferred.promise;	
};

var download = function(url, dest, cb) {
	
	var startTime = process.hrtime();
	  
	http.get(url, function (response) {

		var file = fs.createWriteStream(dest);

		response.pipe(file);
		file.on('finish', function () {
			var endTime = process.hrtime(startTime);
			file.close(cb(endTime));  // close() is async, call cb after close completes.
		});
	});
};