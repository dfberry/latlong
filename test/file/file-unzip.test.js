// 3rd party libraries
//var expect = require('chai').expect;
//var fs = require("fs");

console.log("test file");

// library to test
var unzip = require('../../src/file/file-unzip.js')

// local variables for test
var zippedFile = '../../data/US.zip';
var unzippedDirectory = '../../data/US';

describe("Unzip Test", function(){

	it("Unzip ", function () {

		unzip.decompress('../../data/US.zip', '../../data/US');
	});

	
});