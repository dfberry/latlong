/* jshint node: true */

var tsvConverter = require("../src/file/file-tsv.js");
var tsvFile = '../data/test/tsv/US.tsv';
var path = require("path");
console.log("before conversion");

var tsvFileWithPath = path.join(__dirname, tsvFile);

tsvConverter.tsvToJson(tsvFileWithPath)
		.then(function (tsvJson) {
			console.log(tsvJson);
		})
		.fail(function(error){
			console.log(error);
		});