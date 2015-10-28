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
	
	var status = {};
	
	confileFileCheck(configObject, function(errors, configObject){
		
		if (errors){
			console.log("error LoadByWaterfall");
			callback(errors);
	
		} else {

			InitCountries(configObject, function(error, status){
				// statusForCountry should be a JSON object with an array item for 
				// each waterfall item 
				//status[configObject.country] = statusForCountry;
				//callback(status);
				console.log("InitCountries returned status:" + status);
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
	
	console.log("InitCountries begin");
	
	var arr = configObject.country;

	var arrStatus = "";	
	
	async.forEach(arr,	function(item, callback){
			//eachCountry(configObject, item, function(results){
			//	console.log(results);
			//});
			arrStatus += item + ",";
			callback();
	},
	// 3rd param is the function to call when everything's done
	function(err){
		// All tasks are done now
		console.log(arrStatus);
		cb();
	});
	
/*	
	configObject.country.forEach(function(country){

		console.log("InitCountries done for :" + country);

		//eachCountry(configObject, country, function(results){
		//	//console.log(results);
		//});
		callback(null, "ok");

	});
*/	
}

function eachCountry(configVals, country, cb){

	console.log("eachCountry:" + country);
			
	async.waterfall([
		async.apply(function(configVals, country, callback){
			
			//console.log(configVals);
			console.log(country);
			
			callback(null, country + " func 1");
			/*
			downloadFile(configVals, country, function(results){
				callback(null,results);
			});
			*/
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
		//console.log(result);
		console.log("eachCountry done:");
		cb(null);
	});
};