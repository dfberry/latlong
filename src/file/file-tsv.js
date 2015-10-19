// 3rd party libraries
var tsvLibrary = require('node-require-tsv');
var arrayTransformlibrary = require('array-json-transform');
var Q = require("q");
var fs = require("fs");
var path = require("path");

var myTsvToJson = function(tsvFile, callback){
	
	var deferred = Q.defer();
	
	fs.exists(tsvFile, function(exists){
		
		if(exists==true){
			
			var arrayOfTsvStrings = require(tsvFile); 
			
			deferred.resolve(JSON.stringify(arrayOfTsvStrings));
			
			deferred.promise.nodeify(callback);
		} else {
			deferred.reject("tsv file not found");
		}	
	});
	return deferred.promise;
} 

module.exports = {
	tsvToJson: myTsvToJson
}
