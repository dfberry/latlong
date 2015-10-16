var assert = require("chai").assert;
var unzip = require("../../src/file/file-unzip.js")

var zippedFile = '../../data/US.zip';
var unzippedDirectory = '../../data/test/US';

describe("Decompress Test", function(){

	it("Decompress via callback", function (done) {

		// call back style
		unzip.unzip(zippedFile, unzippedDirectory + '2', function (err, files) {
			//console.log(err);
			console.log(files[0]);
			
			assert.equal(err,null);
			assert.equal(files.length,2);
			
			done();
		});
		
	});
	it("Decompress via promise", function (done) {

		// promise style
		unzip.unzip(zippedFile, unzippedDirectory + '3')
		.then(function (files) {
			console.log(files[0]);
			assert.equal(files.length,2);
			done();
		})
		.fail(function(error){
			console.log(error);
		});
	});	
	
});	