/* jshint node: true */
'use strict';

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var path = require("path");

// custom libraries
var myIOUtils = require("../lib/io-utils.js");
var SUT = require("../lib/unzip.js");

describe("Decompress", function(){

	it("Unzip", function (done) {
		this.timeout(5000);
		
		var pathToFile = path.join(__dirname,"../data/US.zip");
		var pathToDestination = path.join(__dirname, "../data/test/DeleteWhenDone/UnzipTest/");
	
		SUT.unzip(pathToFile,pathToDestination, function (unzipError, unzipStatus) {
			
			myIOUtils.doesFileExist(pathToDestination + "US.txt", function(existsError, existsStatus){

				// unzip
				expect(unzipStatus).to.exist;
				expect(unzipStatus).to.equal(true);
				expect(unzipError).to.be.null;

				// does file exist
				expect(existsStatus).to.exist;
				expect(existsStatus).to.equal(true);
				expect(existsError).to.be.null;
				
				// cleanup
				myIOUtils.deleteFolderRecursiveSync(path.join(__dirname, "../data/test/DeleteWhenDone/"));				
				
				done();				
			});
			
			

		});
	});
});	