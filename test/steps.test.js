/* jshint node: true */
'use strict';

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var path = require("path");

// custom libraries
var myIOUtils = require("../lib/io-utils.js");
var SUT = require("../lib/steps.js");


describe("Steps", function(){

	it("Download", function (done) {
		this.timeout(5000);
		
		var url = "http://download.geonames.org/export/zip/US.zip";
		var destinationFile = path.join(__dirname,"../data/test/DeleteWhenDone/US.zip");
				
		SUT.download(url, destinationFile, function (err, status) {
				expect(status).to.exist;
				expect(err).to.be.null;
				
				myIOUtils.doesFileExist(destinationFile, function(err, boolStatus){
					expect(boolStatus).to.equal(true);
					if(boolStatus==true){
						myIOUtils.deleteFileSync(destinationFile);
					}
				});
				
				done();
		});
		
	});
	
	it("Unzip", function (done) {
		this.timeout(5000);
		
		var pathToFile = path.join(__dirname,"../data/US.zip");
		var pathToDestination = path.join(__dirname, "../data/test/DeleteWhenDone/Unzip/");
		
		SUT.unzip(pathToFile, pathToDestination, function (unzipError, unzipStatus) {

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
				myIOUtils.deleteFolderRecursiveSync(pathToDestination);				
				
				done();				
			});
		});
		
	});	
});	