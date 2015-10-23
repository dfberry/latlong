/* jshint node: true */
'use strict';

//module.exports = Unzip.create = Unzip;
module.exports = Unzip;


// 3rd party libraries
var Q = require("q");
var fs = require("fs");

// custom libraries
var DecompressLibrary = require('decompress');

/**
 * Initialize Unzip
 *
 * @param {Object} opts
 * @api public
 */

function Unzip(opts) {
	if (!(this instanceof Unzip)) {
		return new Unzip(opts);
	}

	this.opts = opts || {};
}
/**
 * Unzip source file
 *
 * @param {string} zipfile 
 * @param {string} unzipLocation
 * @param {function} callback
 * @api public
 */

Unzip.prototype.Unzip(zipfile, unzipLocation, callback){
/*
	var self = this;
	if (!(this instanceof Unzip)) {
		return new Unzip(zipfile, unzipLocation);
	}
*/
	callback = callback || function () {};
	var deferred = Q.defer();

	fs.exists(zipfile, function(exists){
		
		if(exists===true){
			
			new DecompressLibrary()
				.src(zipfile)
				.dest(unzipLocation)
				.use(DecompressLibrary.zip())
				.run(function(err,files){
					
					deferred.resolve(files);
				});
			
			
			deferred.promise.nodeify(callback);
		} else {
			deferred.reject("zip file not found");
		}	
	});
	return deferred.promise;
}; 


