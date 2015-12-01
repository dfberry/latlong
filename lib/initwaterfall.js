/*jslint node: true */
'use strict';

var exports = module.exports = {};

var fs = require("fs");
var isJSON = require('is-json'); 
var path = require("path");
var http = require('http');
var async = require('async');
var process = require('process');
var mongodb = require('mongodb');
var DecompressLibrary = require('decompress');
//require('node-require-tsv');

var customError = require("./error");

/*
Entry point for this module
configObject is a json object

*/



exports.Load= function LoadByWaterfall(configObject, callback){
	
	configFileCheck(configObject, function(errors, configObject){
		
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
// DFB:TODO - clean this up
var configFileCheck = function (config, callback) {
	
	//if(isJsonString(config)){
		if(config.dataurl===undefined){
			callback(new customError.BadConfig("configFile.dataurl===undefined"));
		} else {
			if(config.country===undefined){
				callback(new customError.BadConfig("configFile.country===undefined"));
			} else {
				if (Array.isArray(config.country)===false){
					callback(new customError.BadConfig("configFile.country is not array"));
				} else {
					if(config.country.length===0){
						callback(new customError.BadConfig("configFile.country.length===0"));
					} else {
						if(config.datadirectory===undefined){
							callback(new customError.BadConfig("configFile.datadirectory===undefined"));
						}else{
							fs.lstat(config.datadirectory, function(err, status){
								if(status===undefined){
									callback(new customError.BadConfig("lstatSync status errored - " + err));
								} else {
									if (!status.isDirectory()) {
										callback(new customError.BadConfig("configFile.datadirectory is not directory"));
									} else {
										if(config.datastore===undefined){
											callback(new customError.BadConfig("configFile.datastore===undefined"));
										} else {
											callback(null, config);										
										}
									}
								}
							});										
						}
					}
				}
			}
		}
	//} else {
	//	callback(new customError.BadConfig("isJsonObject(config)==false"));	
	//}
};

function InitCountries(configObject, cb){
	
	var itemStatus = "";
	var finalStatus = "";	
	
	async.forEach(configObject.country,	function(item, callback){
		
		eachCountry(configObject, item, function(error, results){
			itemStatus += "{\"" + item + "\":[" + results + "]},";
			callback();
		});

	},
	// when everything's done
	function(err){
		finalStatus = "{\"Countries\":[" + itemStatus.substr(0,itemStatus.length-1) + "]}"; // get rid of trailing comma
		cb(null, finalStatus);
	});
}
var waterfallDownload = function(config,country, callback){
	
	
	download(config, country, function(error, results){
		if (error){
			callback(error);	
		} else {
			var downloadStatus = "{ \"download\" : " + results + "}";
			
			callback(null, downloadStatus);
		}
	});
};

function eachCountry(config,country,cb){
	
	var waterfallFunctionArray = [];
	
	var waterfallDone = function (err, result) { 
		cb(null, result);
	};

	waterfallFunctionArray.push(async.apply(waterfallDownload, config, country));
	async.waterfall(waterfallFunctionArray, waterfallDone);
}
/*
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
			
		}/*,
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
		}	*/	
//	], waterfallDone);

//}
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
/*
config: entire config file contents, need the following properties
	.datadirectory
country: "US.zip"
previousStatus: from previous waterfall function
callback(err,status)

unzip dir:  datadirectory / countrynameWithoutZipExtension /

*/
function unzip(config, country, previousStatus, callback){

	var mkdirp = require('mkdirp');
	var chmodr = require('chmodr');
	
	// build unzip directory name from country
	var zipfile = config.datadirectory + country
	var pattern = /.zip/ig;
	var unzipLocation = config.datadirectory + country.replace(pattern,"/");
			
	// create directory if it doesn't exist
	mkdirp(unzipLocation, function (err) {
		
		if (err){
			callback(null, "{\"status\": \"false\", \"file\": \"" + zipfile + "\", \"mkdirp error\": \"" + err + "\"}");
		} else {
			// make sure zip file exists
			fs.exists(zipfile, function(exists){
					
				if((exists===undefined) || (exists===false)) {
					callback(null, "{\"status\": \"false\", \"file\": \"" + zipfile + "\", \"fs.exists error\": \"can't find zip file\"}");
				} else {
					// TODO: Decompress isn't creating files with this permission set so 
					// using CHMODR to do that - once that is fixed, remove CHMODR library
					// and usage
					new DecompressLibrary({mode: 444})
						.src(zipfile)
						.dest(unzipLocation)
						//.use(DecompressLibrary.zip())
						.run(function(err,files){
							if (err || (files===undefined)) {
								
								// this can error after the unzip has already happened - not sure why
								// work around is to check to see if unzip directory is found
								doesFileExist(unzipLocation + country.replace(pattern,".txt"), function(err, statusBool){

									if((err == undefined) && (statusBool==true)) {
										chmodr(unzipLocation, '444');
										callback(null, "{\"status\": \"true\", \"destination\": \"" + unzipLocation + "\", \"unzippedFileCount\": \"1\" \"}");
									} else {
										callback(null, "{\"status\": \"false\", \"file\": \"" + zipfile + "\", \"decompress error\": \"" + err + "\"}");
									}
								});
							} else {
								chmodr(unzipLocation, '444');
								doesFileExist(unzipLocation + country.replace(pattern,".txt"), function(err, statusBool){
									
									if((err == undefined) && (statusBool==true)) {
										chmodr(unzipLocation, '444');
										callback(null, "{\"status\": \"true\", \"destination\": \"" + unzipLocation + "\", \"unzippedFileCount\": \"1\" \"}");
									} else {
										callback(null, "{\"status\": \"false\", \"file\": \"" + zipfile + "\", \"decompress error\": \"" + err + "\"}");
									}
								});
							}  
					});
				}	
			});
		}
	});
}; 
/*
convert tab-delimited data to json objects
assumes country file is in its own country directory
created as part of unzip process
data/US/US.txt
returns formatted array of Json objects
*/
exports.parse = function parseFile(config, country, previousStatus, callback){

	//console.log(config);
	//console.log(country);

	var zipfile = config.datadirectory + country //country still has zip extension
	var pattern = /.zip/ig;
	var countryname = country.replace(pattern,"");
	var countryDataFile = config.datadirectory + countryname + "/" + countryname + ".txt";
	var countryDataFilePath= path.join(__dirname, "../" + countryDataFile);	
		
	fs.exists(countryDataFilePath, function(exists){
		
		if (exists){
			
			var parse = require('csv').parse;
			var tabDelimiter = "\t";
	
			var parseOptions = {delimiter: tabDelimiter,quote: false,columns : config.datacolumns.countries};
				
			// TODO: use streams, does this really need utf8?
			var data = fs.readFileSync(countryDataFilePath,'utf8');
								
			// convert tab-delimited data to json objects
			parse(data, parseOptions, function(err,JsonOutput){

				if (err) {
					callback(null, "{\"status\": \"false\", \"file\": \"" + countryDataFile + "\", \"error\": \"" + err + "\"}");
				} else {
					callback(null, JsonOutput);
				}
			});
		} else {
			// file doesn't exist
			//console.log("exists=" + exists);
			//console.log("countryDataFilePath=" + countryDataFilePath);			
		}
	});
};


function verify(config, country, previousStatus, callback){
	callback(null, "{\"status\": \"false\", \"timestamp\": \"" + Date.now() + "\", \"error\": \"" + "to be implemented" + "\"}");	
};
function isJsonString(obj) {
	
	var result = isJSON(obj);
	console.log("result=" + result);
	return result;
};
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
/*
Given path, recursively delete everything 
inside it
*/
function deleteFolderRecursiveSync(path) {

	if( fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file){
			var curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursiveSync(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path); // delete folder
	}
};
/*
doesFileExist
file: path and file name to verify
callback(err,bool)
*/
function doesFileExist(file, callback){
	
	fs.stat(file, function(err, stat) {
		if(err) {
			if(err.code == 'ENOENT') {
				callback(null, false)
			} else {
				callback(null, err.code);
			}
		} else { 
			callback(null,true);
		}
	});
}

/*
copyFile
piped
*/
function copyFile (from, to){
	fs.createReadStream(from).pipe(fs.createWriteStream(to));
}
/*
deleteFile
sync
*/
function deleteFileSync (file){
	fs.unlinkSync(file);
}

exports.previousStatusToBool = previousStatusToBool;
exports.isJsonString = isJsonString;
exports.configFileCheck = configFileCheck;
exports.doesFileExist = doesFileExist;
exports.unzip = unzip;
exports.deleteFolderRecursiveSync = deleteFolderRecursiveSync;
exports.copyFile = copyFile;
exports.deleteFileSync = deleteFileSync;