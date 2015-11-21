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

describe("Decompress Tests", function(){

	it("Decompress unzip test", function (done) {
		this.timeout(5000);
		
		//var archive = path.join(__dirname, zippedFile);
		//var final = path.join(__dirname, unzippedDirectory);		
		
		sut.unzip(config, country, null, function (err, status) {
				expect(status).to.exist;
				expect(err).to.be.null;
				console.log(status);
				
				// path is wrong 
				// /Users/dfberry/repos/latlong/test/data/US/
				//var final = path.join(__dirname, config.datadirectory + "US/" );
				
				//console.log("unzip final = " + final);
				sut.deleteFolderRecursiveSync(config.datadirectory + "US/");				
				
				done();
		});

	});
});	