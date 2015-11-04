/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;

// custom libraries
var tsvConverter = require("../latlong.waterfall.js");
var path = require("path");

var config = require('../data/test/config/configLoadSuccess.success.json');
//console.log(config);

describe("Import tsv file Test", function(){

	it("Returns correctly formatted array", function (done) {
		this.timeout(5000);
		
		
		tsvConverter.Init.import(config,"US","",function(error, results){
			console.log("bottom of tests");
			//console.log(results);
			console.log("error=" + error);
		});
		
		done();
	});
});	
