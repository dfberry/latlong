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

exports.Load = function Load(configObject, callback){
	
	// setup callback into promise
	var deferred = Q.defer();
	
	var statusArray = {};

	confileFileCheck(configObject)
	.then(function(configVals){
		
		downloadFiles(configVals, statusArray)
		.then(function(statusArray){
			//console.log(statusArray);
			deferred.resolve(statusArray);
/*			unzipFiles(statusArray)
			.then(function(statusArray){
		
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
			})
			.fail(function(errorsArray){
				deferred.reject(errorsArray);					
			});	
*/	
					
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
var downloadFiles = function(config, statusArray, callback){

	var deferred = Q.defer();

	async.each(config.country, 

		function(country,done) {
		
		var downloadItems = {};
		var downloadObject = {};

		var status=false;
		var time=0;
					
		download(config.dataurl + country, config.datadirectory + country)
		.then(function(timeToDownload){
			
			if (timeToDownload !== -1){
				status = true;
				time = timeToDownload[1]/1000000;
			}
			downloadItems['status'] = status;
			downloadItems['time'] = time;
			downloadObject["download"] = downloadItems;
			statusArray[country] = downloadObject;
			
			//console.log(statusArray);
			done();
		})
		.fail(function(error){
			downloadItems['error'] = error.Message;
			downloadItems['status'] = status;

			downloadObject["download"] = downloadItems;
			statusArray[country] = downloadObject;
			
			//console.log(statusArray);
			done();			
		});
	}, function finished(err){
		//console.log(statusArray);
		deferred.resolve(statusArray);
	});

	deferred.promise.nodeify(callback);	
	return deferred.promise;

};

var unzipFiles = function(statusArray, callback){
	callback = callback || function () {};
	var deferred = Q.defer();

	var errorConfigFile = new customError.UncategorizedError("unzipFiles()");
	deferred.reject(errorConfigFile);
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
			deferred.reject(new customError.BadDownload(url + " status " + response.statusCode));
		}
		
	});
	
	return deferred.promise;
};
/*
//http://stackoverflow.com/questions/4771614/download-large-file-with-node-js-avoiding-high-memory-consumption
request.addListener('response', function (response) {
        var downloadfile = fs.createWriteStream(filename, {'flags': 'a'});
        sys.puts("File size " + filename + ": " + response.headers['content-length'] + " bytes.");
        response.addListener('data', function (chunk) {
            dlprogress += chunk.length;
            downloadfile.write(chunk, encoding='binary');
        });
        response.addListener("end", function() {
            downloadfile.end();
            sys.puts("Finished downloading " + filename);
        });

    });
*/

var unzip = function(zipfile, unzipLocation, callback){

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
			var errorConfigFile = new customError.BadConfig("configFile===undefined");
			deferred.reject(errorConfigFile);
			return deferred.promise;
			deferred.reject(zipfile + " file not found");
		}	
	});
	return deferred.promise;
}; 