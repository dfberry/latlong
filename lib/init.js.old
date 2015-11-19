/*jslint node: true */
'use strict';

var exports = module.exports = {};

var Q = require("q");
var fs = require("fs");
var path = require("path");
var http = require('http');
var _und = require('underscore');
var async = require('async');
var process = require('process');
var DecompressLibrary = require('decompress');

var customError = require("./error");

// get tsv file - need location and name of file or all files
// convert to json - save as json object in file
// insert into db - mongo takes json objects for insert
//So, in order to save, you need to convert your JSON array into an array/List of DBObjects, or save each array's item
// var jsons = s.map(JSON.stringify);

exports.LoadWaterfall = function LoadWaterfall(configObject, callback){
	
	var status = {};
	
	confileFileCheck(configObject)
		.then(function(config){
			
			forEachCountry(config.country, function(statusForCountry){
				
				// statusForCountry should be a JSON object with an array item for 
				// each waterfall item 
				status[config.country] = statusForCountry;
			});
		})
		.fail(function(errorsArray){
			console.log(errorsArray);
		});	
}

exports.Load = function Load(configObject, callback){
	
	// setup callback into promise
	var deferred = Q.defer();
	
	var statusArray = {};

	confileFileCheck(configObject)
	.then(function(configVals){
		
		downloadFiles(configVals, statusArray)
		.then(function(statusArray){

			unzipFiles(configVals, statusArray)
			.then(function(statusArray){
			deferred.resolve(statusArray);
/*		
				dbContainerCreate(configObject)
				.then(function(statusArray){
		
					importFiles(statusArray)
					.then(function(statusArray){
						deferred.resolve(statusArray);
					})
					.fail(function(errorsArray){
						deferred.reject(errorsArray);
					});
				})	
				.fail(function(errorsArray){
					deferred.reject(errorsArray);
				});	
*/			})
			.fail(function(errorsArray){
				deferred.reject(errorsArray);					
			});	
		})
		.fail(function(errorsArray){
			deferred.reject(errorsArray);
		});
	})
	.fail(function(response){
		deferred.reject(response);
	});
	
	deferred.promise.nodeify(callback);	
	return deferred.promise;
};
// verify good config file
var confileFileCheck = function (configFile, callback) {
	
	
	// setup callback into promise
	var deferred = Q.defer();


	var config = require(configFile);

	if(config===undefined){
		deferred.reject(new customError.BadConfig("configFile===undefined"));
		return deferred.promise;
	}
	
	if(config.dataurl===undefined){
		deferred.reject(new customError.BadConfig("configFile.dataurl===undefined"));
		return deferred.promise;
	}
	
	if(config.country===undefined){
		deferred.reject(customError.BadConfig("configFile.country===undefined"));
		return deferred.promise;
	}else{
		if(config.country.length===0){
			deferred.reject(new customError.BadConfig("configFile.country.length===0"));
			return deferred.promise;
		}
	}
	
	if(config.datadirectory===undefined){
		deferred.reject(new customError.BadConfig("configFile.datadirectory===undefined"));
		return deferred.promise;
	}else{
		var stats = fs.lstatSync(config.datadirectory);
	
		if (!stats.isDirectory()) {
			deferred.reject(new customError.BadConfig("configFile.datadirectory is not directory"));
			return deferred.promise;
		}
	}
	
	if(config.mongodb===undefined){
		deferred.reject(new customError.BadConfig("configFile.mongo-db===undefined"));
		return deferred.promise;
	}

	deferred.resolve(config);
	deferred.promise.nodeify(callback);	
	return deferred.promise;	
};
//part of async waterfall
function forEachCountry(countries, callback){
	
	countries.forEach(function(country){
		eachCountry(country, function(results){
			// results should be JSON of status of each waterfall item
			console.log(results);
		});
	});
}
//part of async waterfall
function eachCountry(configVals, country, callback){
		
	console.log(country);	
		
	async.waterfall([
		async.apply(function(callback){
			downloadFile(configVals, country, function(results){
				callback(null,results);
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
		status = result;
		console.log("eachCountry done function: " + result);
		callback(country + ': ' + status);
	});
};
//part of async waterfall
function downloadFile(config, country, callback){
	
	download(config.dataurl + country, config.datadirectory + country)
		.then(function(timeToDownload){
			callback("{ download: {status: true, time: " + timeToDownload[1]/1000000 + "}}");
		})
		.fail(function(error){
			callback("{ download: {status: false, error: " + error + "}}");
		});
}

var downloadFiles = function(config, statusArray, callback){

	var deferred = Q.defer();

	async.each(config.country, 

		function(country,done) {
		
		var downloadItems = {};
		var downloadObject = {};
					
		download(config.dataurl + country, config.datadirectory + country)
		.then(function(timeToDownload){
			downloadItems['status'] = true;
			downloadItems['time'] = timeToDownload[1]/1000000;
			downloadObject["download"] = downloadItems;
			statusArray[country] = downloadObject;
			done();
		})
		.fail(function(error){
			downloadItems['status'] = false;
			downloadItems['error'] = error;
			downloadObject["download"] = downloadItems;
			statusArray[country] = downloadObject;
			done();			
		});
	}, function finished(err){
		//console.log(statusArray);
		deferred.resolve(statusArray);
	});

	deferred.promise.nodeify(callback);	
	return deferred.promise;

};

var unzipFiles = function(config, statusArray, callback){
	var deferred = Q.defer();

	async.each(statusArray, function(country,done) {
			
		if (statusArray[country].download.status ==true){	
			/*
			unzip(config.datadirectory + country, config.datadirectory + country.replace(".zip","/"))
			.then(function(files){
			*/	
				statusArray[country].unzip.status = true;
//				statusArray[country].unzip.files = files;
				done();
			/*})
			.fail(function(error){
				statusArray[country].unzip.status = true;
				statusArray[country].unzip.files = files;
				done();			
			});
			*/
		}
		else
		{
			statusArray[country].unzip.status = false;
			statusArray[country].unzip.error = "file not found";
			done();				
		}
	}, function finished(err){
		//console.log(statusArray);
		deferred.resolve(statusArray);
	});

	deferred.promise.nodeify(callback);	
	return deferred.promise;
};
var dbContainerCreate = function(statusArray, callback){
	callback = callback || function () {};
	var deferred = Q.defer();

	var errorConfigFile = new customError.UncategorizedError("dbContainerCreate()");
	deferred.reject(errorConfigFile);
	return deferred.promise;
};
var importFiles = function(statusArray, callback){
	callback = callback || function () {};
	var deferred = Q.defer();

	var errorConfigFile = new customError.UncategorizedError("importFiles()");
	deferred.reject(errorConfigFile);
	return deferred.promise;
};
var download = function(url, dest, callback) {
	
	callback = callback || function () {};
	var deferred = Q.defer();
	
	var startTime = process.hrtime();
	  
	//console.log("download " + dest); 
	  
	http.get(url, function (response) {

		if (response.statusCode==200){
			var file = fs.createWriteStream(dest);
	
			response.pipe(file);
			
			file.on('finish', function () {
				//console.log("file finished");
				var endTime = process.hrtime(startTime);
				file.close();  // close() is async, call cb after close completes.
				deferred.resolve(endTime);
			});
		} else {
			//console.log("file not 200");
			deferred.reject(new customError.BadDownload(response.statusCode));
		}
		
	});
	
	return deferred.promise;
};

var unzip = function(zipfile, unzipLocation, callback){

	console.log("unzip: " + zipfile);

	callback = callback || function () {};
	var deferred = Q.defer();

	fs.exists(zipfile, function(exists){
		
		if(exists===true){

			console.log("zipfile:" + zipfile);
			console.log("unzipLocation:" + unzipLocation);
			
			new DecompressLibrary({mode: '444'})
				.src(zipfile)
				.dest(unzipLocation)
				.use(DecompressLibrary.zip())
				.run(function(err,files){
					if (err){
						deferred.reject(err);
					} else {
						deferred.resolve(files);
					}
				});
		} else {
			deferred.reject(zipfile + " file not found");
		}	
	});
	return deferred.promise;
}; 