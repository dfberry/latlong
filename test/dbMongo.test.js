/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;

// custom libraries
var sut = require("../lib/dbMongo.js");

var config = require('../data/test/config/configLoadSuccess.success.json');

config.mongodb.collection = "mochatest-dbMongo";

describe("DB Insert Test", function(){

	it("Insert array of json objects", function (done) {		
		
		var jsonArray = [{"country": "US", "zip" : "98225"},{"country": "US", "zip" : "98227"}]; 
		
		sut.insert(config.mongodb, jsonArray,function(err,results){
			console.log("done");
			done();
		});
	});
});	
