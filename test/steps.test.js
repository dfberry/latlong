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
		
		console.log(destinationFile);
		
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
});	