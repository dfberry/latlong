/* jshint node: true */
// 3rd party libraries
require('node-require-tsv');
var Q = require("q");
var fs = require("fs");


var myTsvToJson = function(tsvFile, callback){
	
	var deferred = Q.defer();
	
	fs.exists(tsvFile, function(exists){
		
		if(exists===true){
			
			var arrayOfTsvStrings = require(tsvFile); 
			
			deferred.resolve(JSON.stringify(arrayOfTsvStrings));
			
			deferred.promise.nodeify(callback);
		} else {
			deferred.reject("tsv file not found");
		}	
	});
	return deferred.promise;
}; 

module.exports = {
	tsvToJson: myTsvToJson
};
