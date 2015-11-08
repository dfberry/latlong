/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;

// custom libraries
var sut = require("../lib/dbMongo.js");

var config = require('../data/test/config/configLoadSuccess.success.json');

config.mongodb.collection = "mochatest-dbMongo";

describe("DB Insert Test", function(){

	it("Insert array of json objects", function (done) {		
		
		// give internet connection more time to get to mongo site
		this.timeout(5000);
		
		var jsonArray = [{"country": "US", "zip" : "98225"},{"country": "US", "zip" : "98227"}]; 
		
		sut.insert(config.mongodb, jsonArray,function(err,results){
			console.log("error=" + err);
			console.log(results);
			
			// results should return something like...
			/*
			{ result: { ok: 1, n: 2 },
				ops: 
				[ { country: 'US', zip: '98225', _id: 563f5911e1be512a074e7181 },
					{ country: 'US', zip: '98227', _id: 563f5911e1be512a074e7182 } ],
				insertedCount: 2,
				insertedIds: [ 563f5911e1be512a074e7181, 563f5911e1be512a074e7182 ] }
			*/
			
			done();
		});
	});
});	
