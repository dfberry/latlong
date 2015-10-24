/*jslint node: true */
'use strict';

var exports = module.exports = {};

var Q = require("q");
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

	if(configFile===undefined){
		//console.log("getTsvFile failure");
		var errorConfigFile = new customError.BadConfig("configFile===undefined");
		deferred.reject(errorConfigFile);
	}
	
	if(configFile.dataurl===undefined){
		//console.log("getTsvFile failure");
		var errorDataUrl = new customError.BadConfig("configFile.dataurl===undefined");
		deferred.reject(errorDataUrl);
	}
	
	if(configFile.country===undefined){
		//console.log("getTsvFile failure");
		var errorcountry = new customError.BadConfig("configFile.country===undefined");
		deferred.reject(errorcountry);
	}
	
	// DO WORK HERE
	//find(configFile,searchObject, function(jsonResult){
	//	deferred.resolve(jsonResult);
	//});
	
	deferred.resolve(true);
	
	return deferred.promise;	
};