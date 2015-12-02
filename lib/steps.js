/*jslint node: true */
'use strict';

var process = require('process');
var http = require('http');
var fs = require("fs");

var customError = require("./error");
var config = require("./config");
var myUnzip = require("./unzip");
var myIOUtils = require("./io-utils");

var exports = module.exports = {};

exports.download = function (url, destination, callback) {

	var startTime = process.hrtime();
	  
	//var url = config.dataurl + country; 
	//var fileDestination = config.datadirectory + country;
	  
	http.get(url, function (response) {

		if (response.statusCode!=200){
			//callback(null, "{\"status\": \"false\", \"url\": \"" + url + "\", \"error\": \"" + response.statusCode + "\"}");
			callback(response.statusCode);
		} else {
			
			var file = fs.createWriteStream(destination);

			response.pipe(file);
			
			file.on('finish', function () {
				
				var endTime = process.hrtime(startTime);
				
				var precision = 3
				var elapsed = endTime[1] / 1000000; // divide by a million to get nano to milli
				var downloadTime = elapsed.toFixed(precision) + " ms"; 
				
				//file.close(callback(null,"{\"status\": \"true\", \"url\": \"" + (config.dataurl + country) + "\", \"time\": \"" + downloadTime  + "\"}"));  
				file.close(callback(null,downloadTime));  
				
			});
		}
	}).on('error', function(e) {
		//callback(null, "{\"status\": \"false\", \"url\": \"" + url + "\", \"error\": \"" + e + "\"}");
		callback(e);
	});
};