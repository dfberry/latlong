/*jslint node: true */
'use strict';

var exports = module.exports = {};
var myIOUtils = require("../lib/io-utils.js");
var customError = require("./error");
var fs = require("fs");
var mkdirp = require('mkdirp');
var chmodr = require('chmodr');
var DecompressLibrary = require('decompress');
	
/*
config: entire config file contents, need the following properties
	.datadirectory
country: "US.zip"
previousStatus: from previous waterfall function
callback(err,status)

unzip dir:  datadirectory / countrynameWithoutZipExtension /

*/
function unzip(config, country, previousStatus, callback){


	
	//console.log("config=" + config);
	//console.log("country=" + country);
	//console.log("previousStatus=" + previousStatus);
	//callback(null, "fake status");
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
								myIOUtils.doesFileExist(unzipLocation + country.replace(pattern,".txt"), function(err, statusBool){

									if((err == undefined) && (statusBool==true)) {
										chmodr(unzipLocation, '444');
										callback(null, "{\"status\": \"true\", \"destination\": \"" + unzipLocation + "\", \"unzippedFileCount\": \"1\" \"}");
									} else {
										callback(null, "{\"status\": \"false\", \"file\": \"" + zipfile + "\", \"decompress error\": \"" + err + "\"}");
									}
								});
							} else {
								chmodr(unzipLocation, '444');
								myIOUtils.doesFileExist(unzipLocation + country.replace(pattern,".txt"), function(err, statusBool){
									
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
var test = function(){console.log("test");}
exports.unzip = unzip;
exports.test = test;