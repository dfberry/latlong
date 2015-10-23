/* jshint node: true */

// 3rd party libraries
var Q = require("q");
var fs = require("fs");

var makeFileReadableForAll = function(file, callback){

	var deferred = Q.defer();
	deferred.promise.nodeify(callback); 
	
	fs.exists(file, function(exists){

		if(exists===true){
			fs.chmod(file, '0444', function(err){

				if(err){
					deferred.reject(err);
				} else {				
					deferred.resolve(null);
				}
			});					
		} else {
			deferred.reject("file not found");
		}	
	});
	return deferred.promise;
}; 

module.exports = {
	makeReadable: makeFileReadableForAll
};
