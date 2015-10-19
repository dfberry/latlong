// 3rd party libraries
var Q = require("q");
var fs = require("fs");
var path = require("path");

var makeFileReadableForAll = function(file, callback){

	var deferred = Q.defer();
	deferred.promise.nodeify(callback); 
	
	var fileWithPath = path.join(__dirname, file);
	
	fs.exists(fileWithPath, function(exists){

		if(exists==true){
			fs.chmod(fileWithPath, '0444', function(err){

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
} 

module.exports = {
	makeReadable: makeFileReadableForAll
}
