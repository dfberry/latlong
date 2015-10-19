// 3rd party libraries
var assert = require("chai").assert;

// custom libraries
var tsvConverter = require("../src/file/file-tsv.js")

// globals
var tsvFile = '../data/test/tsv/US.tsv';

describe("Tab-seperated file Conversion Test", function(){

	it("Converts to Array via callback", function (done) {
		this.timeout(5000);
		tsvConverter.tsvToArray(tsvFile, function (err, tsvArray) {
			assert.equal(err,null);
			assert.equal(tsvArray.length,43633);
			
		});
		done();
	});
	it("Converts to Array via promise", function (done) {
		tsvConverter.tsvToArray(tsvFile)
		.then(function (tsvArray) {
			assert.equal(tsvArray.length,43633);
			done();
		})
		.fail(function(error){
			done();
		});
	});	
	
});	