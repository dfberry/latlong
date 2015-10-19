// 3rd party libraries
var tsvLibrary = require('node-require-tsv');
var arrayTransformlibrary = require('array-json-transform');
var Q = require("q");
var fs = require("fs");
var path = require("path");

var myTsvToArray = function(tsvfile, callback){

	var deferred = Q.defer();
	var tsvFileWithPath = path.join(__dirname, tsvfile);
	
	fs.exists(tsvFileWithPath, function(exists){
		
		if(exists==true){
			
			var arrayOfTsvStrings = require(tsvFileWithPath); 
			
			deferred.resolve(arrayOfTsvStrings);
			
			deferred.promise.nodeify(callback);
		} else {
			deferred.reject("tsv file not found");
		}	
	});
	return deferred.promise;
} 
module.exports = {
	tsvToArray: myTsvToArray
}
