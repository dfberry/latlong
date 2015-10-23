/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;

// custom libraries
var tsvConverter = require("../src/file/file-tsv.js");
var path = require("path");
// globals
var tsvFile = '../data/test/tsv/US.tsv';

describe("Tab-seperated file Conversion Test", function(){

	it("Converts to Array via callback", function (done) {
		this.timeout(5000);
		var final = path.join(__dirname, tsvFile);		
		tsvConverter.tsvToJson(final, function (err, tsvJson) {
			console.log(tsvJson);
			assert.equal(err,null);
			assert.equal(tsvJson.length,43633);
			
		});
		done();
	});
	it("Converts to Array via promise", function (done) {
		tsvConverter.tsvToJson(tsvFile)
		.then(function (tsvJson) {
			assert.equal(tsvJson.length,43633);
			done();
		});

	});	
	
});	