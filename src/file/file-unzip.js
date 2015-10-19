// 3rd party libraries
var Q = require("q");
var fs = require("fs");
var path = require("path");

// custom libraries
var DecompressLibrary = require('decompress');

var mydecompress = function (zipfile, unzipLocation, callback){

	var deferred = Q.defer();

	var archive = path.join(__dirname, zipfile);
	var final = path.join(__dirname, unzipLocation);
	
	fs.exists(archive, function(exists){
		
		if(exists==true){
			
			var decompress = new DecompressLibrary()
				.src(archive)
				.dest(final)
				.use(DecompressLibrary.zip())
				.run(function(err,files){
					
					deferred.resolve(files)
				});
			
			
			deferred.promise.nodeify(callback);
		} else {
			deferred.reject("zip file not found");
		}	
	});
	return deferred.promise;
} 
module.exports = {
	unzip: mydecompress
}

