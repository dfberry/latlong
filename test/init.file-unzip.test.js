/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var path = require("path");

// custom libraries
var sut = require("../lib/initwaterfall.js");
var country = "US.zip";
var config = {
	"datadirectory": "data/",
	"unzipfileCHMOD":"444", 
};

describe("Decompress Test", function(){

	afterEach(function(done) {
		var final = path.join(__dirname, config.datadirectory + "US/" );
		console.log("after each=" + final);
		fileMgmt.deleteFolderRecursiveSync(final);
		done();
	});

	it("Decompress", function (done) {
		this.timeout(5000);
		
		//var archive = path.join(__dirname, zippedFile);
		//var final = path.join(__dirname, unzippedDirectory);		
		
		sut.unzip(config, country, null, function (err, status) {
				expect(status).to.exist;
				expect(err).to.be.null;
				console.log(status);
				
				var final = path.join(__dirname, config.datadirectory + "US/" );
				console.log("after each=" + final);
				fileMgmt.deleteFolderRecursiveSync(final);				
				
				done();
		});

	});
	
	it("Delete Recursively", function (done) {
		this.timeout(5000);
		var final = path.join(__dirname, config.datadirectory + "US/" );
			
		sut.deleteFolderRecursiveSync(final);
		
		sut.doesFileExist(final,function(err,stat){
			if (err || (stat==undefined)){
				assert.fail();
			} else {
				assert.equal(stat,true);
			}
		
		});

	});	

});	