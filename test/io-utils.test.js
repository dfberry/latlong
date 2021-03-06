/* jshint node: true */
'use strict';

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var path = require("path");
var mkdirp = require('mkdirp');

// custom libraries
var SUT = require("../lib/io-utils.js");
var myIOUtils = require("../lib/io-utils.js");


var folder = "data/test/deleteRecursive";
var fromFile = "data/US.zip";
var toFile = "data/US.copy.test.zip";

/*
Assumptions:
Copy Test: data/US.zip is a valid file in that location

*/

describe("File Mgmt ", function(){

	it("Delete Recursively", function (done) {
		this.timeout(5000);
	
		var final = path.join(__dirname,folder); 
			
		// create directory
		mkdirp(folder, function(err){
			if (err){
				assert.fail();
			} else {
				
				// using time out to see the folder come and go
				// if run manually
				setTimeout(function() {

					// act
					SUT.deleteFolderRecursiveSync(final);
					
					// assert
					SUT.doesFileExist(final,function(err,stat){

						if (err || (stat==undefined)){
							assert.fail();
						} else {
							if (stat==true){
								assert.fail();	
							} else {
								// test passed - yeah
								assert.equal(stat,false);
							}
						}
						done();
					
					});
						
				}, 3000);
			}		
		});			
	});
	
	it("Copy File", function (done) {
		this.timeout(5000);

		var fromFileCopy = "../data/US.zip";
		var toFileCopy = "../data/test/DeleteWhenDone/US.copy.test.zip";

		var fromFile = path.join(__dirname,fromFileCopy); 
		var toFile = path.join(__dirname,toFileCopy); 
		
		// act
		SUT.copyFile(fromFile,toFile);
		
		// assert
		SUT.doesFileExist(toFile,function(err,fileExists){

			if (err || (fileExists==undefined)){
				assert.fail();
			} else {
				// test passed - yeah
				assert.equal(fileExists,true);
				
				// delete file
				SUT.deleteFileSync(toFile);
				
			}
			done();
		});
	});	


});	