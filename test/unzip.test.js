/* jshint node: true */
'use strict';

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var path = require("path");

// custom libraries
var myIOUtils = require("../lib/io-utils.js");
var SUT = require("../lib/unzip.js");
var country = "US.zip";
var config = {
	"datadirectory": "data/",
	"unzipfileCHMOD":"444", 
};

describe("Decompress", function(){

	it("Unzip", function (done) {
		this.timeout(5000);
		
		//var archive = path.join(__dirname, zippedFile);
		//var final = path.join(__dirname, unzippedDirectory);		
		SUT.unzip(config, country, "previous status is YEAH", function (err, status) {
				expect(status).to.exist;
				expect(err).to.be.null;
				
				myIOUtils.deleteFolderRecursiveSync(config.datadirectory + "US/");				
				
				done();
		});
	});
});	