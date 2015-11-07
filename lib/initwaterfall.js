/*jslint node: true */
'use strict';

var exports = module.exports = {};

var fs = require("fs");
var path = require("path");
var http = require('http');
var async = require('async');
var process = require('process');
var mongodb = require('mongodb');

var DecompressLibrary = require('decompress');
//require('node-require-tsv');

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

	console.log(configFile);

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
			status += "{\"" + item + "\":[" + results + "]},";
			callback();
		});

	},
	// when everything's done
	function(err){
		//console.log(status);
		status = "{\"Countries\":[" + status.substr(0,status.length-1) + "]}"; // get rid of trailing comma
		cb(null, status);
	});
}

function eachCountry(config, country, cb){

	var countryStatus = "";	
	
	async.waterfall([
		function(callback){
				
				download(config, country, function(error, results){
					if (error){
						callback(error);	
					} else {
						var downloadStatus = "{ \"download\" : " + results + "}";
						countryStatus += downloadStatus + ",";
						
						// while I want to catch all results,
						// only pass on immediate results to next function
						callback(null, downloadStatus);
					}
				});
			
		},
		function(previousStatus, callback) {
			if (previousStatusToBool(previousStatus, "download")){

				unzip(config, country, previousStatus, function(error, results){
					if (error) {
						callback(error);
					} else {
						var unzipStatus = "{ \"unzip\" : " + results + "}";
						countryStatus +=unzipStatus + ",";
						callback(null, unzipStatus);
					}
				});
				
			} else {
				var unzipStatus = "{ \"unzip\" : {\"status\": \"false\", \"error\": \"previous step failed\"}}";
				countryStatus +=  unzipStatus + ",";		
				callback(null, unzipStatus);				
			}

		},
		function(previousStatus, callback) {
			if (previousStatusToBool(previousStatus,"unzip")){

				createDBContainer(config, country, previousStatus, function(error, results){
					if (error) {
						callback(error);
					} else {
						var dbContainerStatus = "{ \"dbcontainer\" : " + results + "}";
						countryStatus +=dbContainerStatus + ",";
						callback(null, dbContainerStatus);
					}
				});
				
			} else {
				var dbContainerStatus = "{ \"dbcontainer\" : {\"status\": \"false\", \"error\": \"previous step failed\"}}";
				countryStatus += dbContainerStatus + ",";	
				callback(null, dbContainerStatus);				
			}

		},
		function(previousStatus, callback){ 
			if (previousStatusToBool(previousStatus,"dbcontainer")){

				importTSV(config, country, previousStatus, function(error, results){
					if (error) {
						callback(error);
					} else {
						var importTSVStatus = "{ \"importTSV\" : " + results + "}";
						countryStatus +=importTSVStatus  + ",";	
						callback(null, importTSVStatus);
					}
				});
				
			} else {
				var importTSVStatus = "{ \"importTSV\": {\"status\": \"false\", \"error\": \"previous step failed\"}}";
				countryStatus += importTSVStatus + ",";		
				callback(null, importTSVStatus);				
			}
		},		
		function(previousStatus, callback){  
			if (previousStatusToBool(previousStatus,"importTSV")){

				verify(config, country, previousStatus, function(error, results){
					if (error) {
						callback(error);
					} else {
						var verifyStatus = "{ \"verify\" : " + results + "}";
						countryStatus +=verifyStatus;
						callback(null, verifyStatus);
					}
				});
				
			} else {
				var unzipStatus = "{ \"verify\" : {\"status\": \"false\", \"error\": \"previous step failed\"}}";
				countryStatus += unzipStatus;		
				callback(null, unzipStatus);				
			}			
		}		
	], function (err, result) {
		cb(null, countryStatus);
	});

}
function download(config, country, callback) {

	var startTime = process.hrtime();
	  
	var url = config.dataurl + country; 
	var fileDestination = config.datadirectory + country;
	  
	http.get(url, function (response) {

		if (response.statusCode!=200){
			callback(null, "{\"status\": \"false\", \"url\": \"" + url + "\", \"error\": \"" + response.statusCode + "\"}");
		} else {
			
			var file = fs.createWriteStream(fileDestination);

			response.pipe(file);
			
			file.on('finish', function () {
				
				var endTime = process.hrtime(startTime);
				
				var precision = 3
				var elapsed = endTime[1] / 1000000; // divide by a million to get nano to milli
				var downloadTime = elapsed.toFixed(precision) + " ms"; 
				
				file.close(callback(null,"{\"status\": \"true\", \"url\": \"" + (config.dataurl + country) + "\", \"time\": \"" + downloadTime  + "\"}"));  
				
			});
		}
	}).on('error', function(e) {
		callback(null, "{\"status\": \"false\", \"url\": \"" + url + "\", \"error\": \"" + e + "\"}");
	});
};
function unzip(config, country, previousStatus, callback){

	var mkdirp = require('mkdirp');
	var chmodr = require('chmodr');
	var zipfile = config.datadirectory + country
	var pattern = /.zip/ig;
	var unzipLocation = config.datadirectory + country.replace(pattern,"/");
			
	mkdirp(unzipLocation, function (err) {
		
		if (err){
			callback(null, "{\"status\": \"false\", \"file\": \"" + zipfile + "\", \"error\": \"" + err + "\"}");
		} else {
			fs.exists(zipfile, function(exists){
					
				if(exists===false) {
					callback(null, "{\"status\": \"false\", \"file\": \"" + zipfile + "\", \"error\": \"can't find zip file\"}");
				} else {
					// TODO: Decompress isn't creating files with this permission set so 
					// using CHMODR to do that - once that is fixed remove CHMODR library
					// and usage
					new DecompressLibrary({mode: 444})
						.src(zipfile)
						.dest(unzipLocation)
						.use(DecompressLibrary.zip())
						.run(function(err,files){
							if (err) {
								callback(null, "{\"status\": \"false\", \"file\": \"" + zipfile + "\", \"error\": \"" + err + "\"}");
							} else {
								chmodr(unzipLocation, '444');
								callback(null, "{\"status\": \"true\", \"destination\": \"" + unzipLocation + "\", \"unzippedFileCount\": \"" + files.length  + "\"}");
								
							}  
					});
				}	
			});
		}
	});
}; 

exports.parse = function parseFile(config, country, previousStatus, callback){

	//console.log(config);
	//console.log(country);

	var zipfile = config.datadirectory + country //country still has zip extension
	var pattern = /.zip/ig;
	var countryname = country.replace(pattern,"");
	var countryDataFile = config.datadirectory + countryname + "/" + countryname + ".txt";
	var countryDataFilePath= path.join(__dirname, "../" + countryDataFile);	
		
	console.log(countryDataFilePath);	
		
	fs.exists(countryDataFilePath, function(exists){
		
		console.log("exists=" + exists);
		
		if (exists){
			
			var parse = require('csv').parse;
			var tabDelimiter = "\t";
	
			var parseOptions = {delimiter: tabDelimiter,quote: false,columns : config.datacolumns.countries};

			//console.log("parseOptions");
			//console.log(parseOptions);	
			
			// TODO: use streams, does this really need utf8?
			var data = fs.readFileSync(countryDataFilePath,'utf8');
				
			//console.log("data");
			//console.log(data);	
				
			// convert tab-delimited data to json objects
			parse(data, parseOptions, function(err,output){
				if (err) console.log("parse error");
				
				//console.log("parse succeeded");
				//console.log(output);
				callback(null, output);
			});
		}

	});
};


function verify(config, country, previousStatus, callback){
	callback(null, "{\"status\": \"false\", \"timestamp\": \"" + Date.now() + "\", \"error\": \"" + "to be implemented" + "\"}");	
};
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function previousStatusToBool(previousStatus,section){
	
	var lastStatus="";
	var result;
	
	try{
		lastStatus = JSON.parse(previousStatus);
	} catch(e){
		console.log("json parse error");
		throw e;
	}
	
	var lastStatusBool = lastStatus[section].status;

	// JSON converts to string
	if (lastStatusBool=='true'){
		
		return true;
	} else {
		return false;
	}
};

exports.previousStatusToBool = previousStatusToBool;