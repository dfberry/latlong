/*jslint node: true */
'use strict';

var exports = module.exports = {};

var fs = require("fs");
var path = require("path");
var http = require('http');
var async = require('async');
var process = require('process');
var DecompressLibrary = require('decompress');

var customError = require("./error");

exports.Load= function LoadByWaterfall(configObject, callback){
	
	confileFileCheck(configObject, function(errors, configObject){
		
		if (errors){
			callback(errors);
		} else {

			InitCountries(configObject, function(error, status){
				callback(null, status);
			});
		}
	});
}
// verify good config file
var confileFileCheck = function (configFile, callback) {

	var config = require(configFile);

	if(config===undefined){
		callback(new customError.BadConfig("configFile===undefined"));
	}
	
	if(config.dataurl===undefined){
		callback(new customError.BadConfig("configFile.dataurl===undefined"));
	}
	
	if(config.country===undefined){
		callback(customError.BadConfig("configFile.country===undefined"));
	}else{
		if (Array.isArray(config.country)===false){
			callback(new customError.BadConfig("configFile.country is not array"));
		} else {
			if(config.country.length===0){
				callback(new customError.BadConfig("configFile.country.length===0"));
			}
		}
	}
	
	if(config.datadirectory===undefined){
		callback(new customError.BadConfig("configFile.datadirectory===undefined"));
	}else{
		var stats = fs.lstatSync(config.datadirectory);
	
		if (!stats.isDirectory()) {
			callback(new customError.BadConfig("configFile.datadirectory is not directory"));
		}
	}
	
	if(config.mongodb===undefined){
		callback(new customError.BadConfig("configFile.mongo-db===undefined"));
	}
	
	callback(null, config);
};

function InitCountries(configObject, cb){
	
	var status = "";	
	
	async.forEach(configObject.country,	function(item, callback){
		
		eachCountry(configObject, item, function(error, results){
			status += "{'" + item + "':" + results + "},";
			callback();
		});

	},
	// when everything's done
	function(err){
		//console.log(status);
		status = status.substr(0,status.length-1);// get rid of trailing comma
		cb(null, status);
	});
}

function eachCountry(configVals, country, cb){

	var countryStatus = "";		
			
	async.waterfall([
		async.apply(function(configVals, country, callback){
			
			downloadFile(configVals, country, function(error, results){
				if (error) callback(error);
				countryStatus += "{ 'download' : " + results + "}";
				callback(null, results);
			});
			
		},configVals, country)/*, // pass country into first function
		function(arg1, callback){
			unzip(country, function(results){
				callback(null,results);
			});			
		},
		function(arg2, callback){
			console.log("arg2=" + arg2);
			callback(null,arg2 + 10);
		}*/
		
	], function(err, result){
		//console.log(countryStatus);
		cb(null, countryStatus);
	});
};
function downloadFile(config, country, callback){
	
	download(config.dataurl + country, config.datadirectory + country,
		function(error, results){
			
			if (error){
				//console.log("downloadfile is not 200");
				callback(null, "{'status': 'false', 'url': '" + (config.dataurl + country) + "', 'error': '" + error + "'}");
			}
	
			callback(null, "{'status': 'true', 'url': '" + (config.dataurl + country) + "', 'time': '" + results  + "'}");
			
		});
};
function download(url, destination, callback) {

	var startTime = process.hrtime();
	  
	http.get(url, function (response) {

		if (response.statusCode!==200){
		 	callback(response.statusCode);
		}

		var file = fs.createWriteStream(destination);

		response.pipe(file);
		
		file.on('finish', function () {
			
			var endTime = process.hrtime(startTime);
			
			var precision = 3
			var elapsed = endTime[1] / 1000000; // divide by a million to get nano to milli
    		var downloadTime = elapsed.toFixed(precision) + " ms"; 
			
			
			file.close(callback(null,downloadTime));  // close() is async, call cb after close completes.
			
		});
	});
	
};