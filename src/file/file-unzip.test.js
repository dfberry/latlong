// 3rd party libraries
//var expect = require('chai').expect;
//var fs = require("fs");

// library to test
var unzip = require('./file-unzip.js')

// local variables for test
var zippedFile = 'US.zip';
var unzippedDirectory = 'US';

describe("Decompress Test", function(){

	it("Decompress", function () {

		console.log("about to decompress");

		unzip.decompress(zippedFile, unzippedDirectory,function(err, files){
			console.log("err");
			console.log(err);
			console.log("files");
			console.log(files.length);
		});
	});

	
});