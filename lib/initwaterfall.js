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
var config = require("./config");
var myUnzip = require("./unzip");
var myIOUtils = require("./io-utils");
var steps = require("../lib/steps.js");
/*
Entry point for this module
configObject is a json object

*/



exports.Load= function LoadByWaterfall(configObject, callback){
	
	config.FileCheck(configObject, function(errors, configObject){
		
		if (errors){
			callback(errors);
		} else {
			InitCountries(configObject, function(error, status){
				callback(null, status);
			});
		}
	});
}


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
exports.step1Download = function(config,country, callback){
	
	var countryFile = country + ".zip";
	var url = config.dataurl +  countryFile
	var fileDestination = path.join(__dirname,config.datadirectory + countryFile);

	steps.download(url,fileDestination,function(err,status){
		if (err){
			callback(null, "{ \"download\" : " + "{\"status\": \"false\", \"url\": \"" + url + "\", \"error\": \"" + err + "\"}}");		
		} else {
			callback(null,"{ \"download\" : " + "{\"status\": \"true\", \"url\": \"" + url + "\", \"file\":" + fileDestination + ", \"time\": \"" + status  + "\"}}")
		}
	});	
};
var waterfallUnzip = function(config, country, previousStatus, callback){
	
	console.log("config=" + config);
	console.log("country=" + country);
	console.log("previousStatus=" + previousStatus);
	//callback(null, "fake status");s
/*	
	myUnzip.unzip(config, country, function(error, results){
			
		if (error){
			callback(error);	
		} else {
			var downloadStatus = "{ \"unzip\" : " + results + "}";
			
			callback(null, downloadStatus);
		}
	});
*/
};

var waterfallCreateDBContainer = function(config, country, previousStatus, callback){
	
	//console.log("config=" + config);
	//console.log("country=" + country);
	//console.log("previousStatus=" + previousStatus);
	
	createDBContainer(config, country, previousStatus, function(error, results){
		if (error) {
			callback(error);
		} else {
			var dbContainerStatus = "{ \"dbcontainer\" : " + results + "}";

			callback(null, dbContainerStatus);
		}
	});
};

var waterfallImportTSV = function(config, country, previousStatus, callback){
	
	//console.log("config=" + config);
	//console.log("country=" + country);
	//console.log("previousStatus=" + previousStatus);
	
	importTSV(config, country, previousStatus, function(error, results){
		if (error) {
			callback(error);
		} else {
			var importTSVStatus = "{ \"importTSV\" : " + results + "}";
			callback(null, importTSVStatus);
		}
	});
};
var waterfallVerify = function(config, country, previousStatus, callback){
	
	//console.log("config=" + config);
	//console.log("country=" + country);
	//console.log("previousStatus=" + previousStatus);
	
	verify(config, country, previousStatus, function(error, results){
		if (error) {
			callback(error);
		} else {
			var verifyStatus = "{ \"verify\" : " + results + "}";
			callback(null, verifyStatus);
		}
	});
};
function eachCountry(config,country,cb){
	
	var waterfallFunctionArray = [];
	
	var waterfallDone = function (err, result) { 
		console.log("err=" + err);
		console.log("result=" + result);
		cb(null, result);
	};

	// push config and country params as initial value to waterfall func named waterfallDownload
	// step 1
	waterfallFunctionArray.push(async.apply(waterfallDownload, config, country));
	
	// step 2
	//waterfallFunctionArray.push(waterfallUnzip);
	
	// step 3
	//waterfallFunctionArray.push(waterfallCreateDBContainer);
	
	// step 4
	//waterfallFunctionArray.push(waterfallImportTSV);
	
	// step 5
	//waterfallFunctionArray.push(waterfallVerify);	
	
	// call waterfall with array of functions and done function
	async.waterfall(waterfallFunctionArray, waterfallDone);
}

exports.download = function download(config, country, callback) {
	var url = config.dataurl + country; 
	var fileDestination = config.datadirectory + country;

	steps.download(url,fileDestination,function(err,status){
		if (err){
			callback(null, "{\"status\": \"false\", \"url\": \"" + url + "\", \"error\": \"" + err + "\"}");		
		} else {
			callback(null,"{\"status\": \"true\", \"url\": \"" + (config.dataurl + country) + "\", \"time\": \"" + status  + "\"}")
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
				
			// TODO: use streams, does this really need utf8?
			var data = fs.readFileSync(countryDataFilePath,'utf8');
								
			// convert tab-delimited data to json objects
			myIOUtils.parseTsvToJson(data, config.datacolumns.countries, function(err,JsonOutput){

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
/*
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
*/

