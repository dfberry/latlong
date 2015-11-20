/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var path = require("path");

// custom libraries
var mkdirp = require('mkdirp');
var sut = require("../lib/initwaterfall.js");
var folder = "data/test/deleteRecursive"

describe("Decompress Test", function(){

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

					// act
					sut.deleteFolderRecursiveSync(final);
					
					// assert
					sut.doesFileExist(final,function(err,stat){
						console.log("stat = " + stat);
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
});	