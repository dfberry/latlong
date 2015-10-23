/*jslint node: true */
'use strict';

module.exports = Init;

var Q = require("q");
var fs = require("fs");

function Init(configFile, callback) {
	
	// setup callback into promise
	var deferred = Q.defer();
	deferred.promise.nodeify(callback);

	// DO WORK HERE
	var err = null;

	if (err) {
		//failure
		deferred.reject(err);
	} else {
		// success
		deferred.resolve(true);
	}
	
	return deferred.promise;	

}