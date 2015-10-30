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
			
			download(configVals, country, function(error, results){
				if (error) callback(error);
				countryStatus += "{ 'download' : " + results + "}";
				callback(null, results);
			});
			
		},configVals, country)/*, // pass into first function
		function(configVals, country, countryStatus, callback){
			
			unzip(configVals, country, countryStatus, function(error, results){
				if (error) callback(error);
				countryStatus += "{ 'unzip' : " + results + "}";
				callback(null, results);
			});
		}/*,
		function(arg2, callback){
			console.log("arg2=" + arg2);
			callback(null,arg2 + 10);
		}*/
		
	], function(err, result){
		cb(null, countryStatus);
	});
};
function download(config, country, callback) {

	var startTime = process.hrtime();
	  
	var url = config.dataurl + country; 
	var fileDestination = config.datadirectory + country;
	  
	http.get(url, function (response) {

		if (response.statusCode!=200){
			callback(null, "{'status': 'false', 'url': '" + url + "', 'error': '" + response.statusCode + "'}");
		} else {
			
			var file = fs.createWriteStream(fileDestination);

			response.pipe(file);
			
			file.on('finish', function () {
				
				var endTime = process.hrtime(startTime);
				
				var precision = 3
				var elapsed = endTime[1] / 1000000; // divide by a million to get nano to milli
				var downloadTime = elapsed.toFixed(precision) + " ms"; 
				
				file.close(callback(null,"{'status': 'true', 'url': '" + (config.dataurl + country) + "', 'time': '" + downloadTime  + "'}"));  
				
			});
		}
	});
};
function unzip(config, country, currentStatus, callback){

	console.log("config");
	console.log(config);
	
	console.log("country");
	console.log(country);
	
	console.log("currentStatus");
	console.log(currentStatus);
/*
	var zipfile = config.datadirectory + country
	var pattern = /.zip/ig;
	
	console.log("country:" + country);
	
	var unzipLocation = config.datadirectory + country.replace(pattern,"/")

	if (currentStatus.download.status==false) callback(null, "{'status': 'false', 'error': 'download status == false, no file to unzip'}");
	
	fs.exists(zipfile, function(exists){
		
		if(exists===false) callback(null, "{'status': 'false', 'file': '" + zipfile + "', 'error': 'zip file doesn't exist'}");
	
		new DecompressLibrary({mode: config.unzipfileCHMOD})
			.src(zipfile)
			.dest(unzipLocation)
			.use(DecompressLibrary.zip())
			.run(function(err,files){
				if (err) callback(null, "{'status': 'false', 'file': '" + zipfile + "', 'error': '" + err + "'}");

				callback(null,"{'status': 'true', 'file': '" + zipfile + "', 'unzippedFileCount': '" + files.length  + "'}");  
			});
	});*/
}; 