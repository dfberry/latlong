var customError = require("./error");
var fs = require("fs");
var parse = require('csv').parse;

var exports = module.exports = {};

/*
Given complete path, recursively delete everything 
inside it
return: doesn't return anything
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
file: complete path and file name to verify
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
from: complete path - from file
to: complete path - to file
*/
function copyFile (from, to){
	fs.createReadStream(from).pipe(fs.createWriteStream(to));
}
/*
deleteFile
sync
file: complete path to file
*/
function deleteFileSync (file){
	fs.unlinkSync(file);
}
/*
Purpose: convert tsv to json
tsvData: tab-delimited data to json objects
tsvColumnNames: array of strings - column names converted into json keys in each array element
returns formatted array of Json objects
*/
var parseTsvToJson = function (tsvData, tsvColumnNames, callback){

	var tabDelimiter = "\t";
	var parseOptions = {delimiter: tabDelimiter,quote: false,columns : tsvColumnNames};
					
	// convert tab-delimited data to json objects
	parse(tsvData, parseOptions, function(err,jsonOutput){

		if (err) {
			callback(err);
		} else {
			callback(null, jsonOutput);
		}
	});
};

exports.deleteFolderRecursiveSync = deleteFolderRecursiveSync;
exports.copyFile = copyFile;
exports.deleteFileSync = deleteFileSync;
exports.doesFileExist = doesFileExist;
exports.parseTsvToJson = parseTsvToJson;