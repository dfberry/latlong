/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var path = require("path");

// custom libraries
var mkdirp = require('mkdirp');
var sut = require("../lib/initwaterfall.js");
var folder = "data/test/deleteRecursive";


var fromFile = "data/US.zip";
var toFile = "data/US.copy.test.zip";

/*
Assumptions:
Copy Test: data/US.zip is a valid file in that location

*/

describe("File Mgmt ", function(){
/*
	it("Delete Recursively", function (done) {
		this.timeout(5000);
	
		var final = folder; 
			
		// create directory
		mkdirp(folder, function(err){
			if (err){
				assert.fail();
			} else {
				
				// using time out to see the folder come and go
				// if run manually
				setTimeout(function() {

					console.log("file mgmt final" + final);

					// act
					sut.deleteFolderRecursiveSync(final);
					
					// assert
					sut.doesFileExist(final,function(err,stat){

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
*/	
	it("Copy File", function (done) {
		this.timeout(5000);
		
		// act
		sut.copyFile(fromFile,toFile);
		
		// assert
		sut.doesFileExist(toFile,function(err,fileExists){

			if (err || (fileExists==undefined)){
				assert.fail();
			} else {
				// test passed - yeah
				assert.equal(fileExists,true);
				
				// delete file
				sut.deleteFileSync(toFile);
				
			}
			done();
		});
	});		
});	