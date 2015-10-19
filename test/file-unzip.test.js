// 3rd party libraries
var assert = require("chai").assert;
var fs = require('fs');
var path = require("path");

// custom libraries
var unzip = require("../src/file/file-unzip.js");
var fileMgmt = require("../src/file/file-mgmt.js");

// globals
var zippedFile = '../data/US.zip';
var unzippedDirectory = '../data/test/US';
var unzippedDirectoryPost = '-unziptest';

describe("Decompress Test", function(){

	afterEach(function(done) {
		var final = path.join(__dirname, unzippedDirectory);
		
		fileMgmt.deleteFolderRecursiveSync(final + unzippedDirectoryPost);
		done();
	});

	it("Decompress via callback", function (done) {
		this.timeout(5000);
		unzip.unzip(zippedFile, unzippedDirectory + unzippedDirectoryPost, function (err, files) {
			if (!err){
				
				assert.equal(err,null);
				assert.equal(files.length,2);
			}
			
		});
		done();
	});
	
	it("Decompress via promise", function (done) {
		unzip.unzip(zippedFile, unzippedDirectory + unzippedDirectoryPost)
		.then(function (files) {
			assert.equal(files.length,2);
		})
		.fail(function(error){

		});
		done();
	});	
});	