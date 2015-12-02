/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;

// custom libraries
var SUT = require("../lib/mongoDb.js");

var config = {
	"dataurl": "http://download.geonames.org/export/zip/",
	"country" : ["abc.zip", "US.zip", "CA.zip", "AG.zip", "RU.zip"],
	"datadirectory": "data/test/integration/",
	"unzipfileCHMOD":"444", 
	"datastore" : {
		"type": "mongodb",
		"config": {
			"mongodb" : {
				"collection": "geoZip",
				"deleteCollectionIfExists": "true"
			}
		}	
	},
	"datacolumns" : {
		"countries" : [
			"countrycode",     
			"postalcode",       
			"placename",        
			"adminname1",       
			"admincode1",      
			"adminname2" ,      
			"admincode2",       
			"adminname3" ,      
			"admincode3" ,      
			"latitude" ,         
			"longitude" ,        
			"accuracy"  			
		]
	}
};
var secureConfig = require("../data/test/config/config.secure.json");

/* 
need to add url, user, and pwd to mongodb json object
*/
config.datastore.config.mongodb.url = secureConfig.mongodb.url;
config.datastore.config.mongodb.user = secureConfig.mongodb.user;
config.datastore.config.mongodb.pwd = secureConfig.mongodb.pwd;

config.datastore.config.mongodb.collection = "mochatest-mongoDB";

describe("MongoDB Test", function(){

	it("Insert array of json objects", function (done) {		
		
		// give internet connection more time to get to mongo site
		this.timeout(20000);
		
		var jsonArray = [{"country": "US", "zip" : "98225"},{"country": "US", "zip" : "98227"}]; 
		
		SUT.insert(config.datastore.config.mongodb, jsonArray,function(err,results){
			
			// results should return something like...
			/*
			{ result: { ok: 1, n: 2 },
				ops: 
				[ { country: 'US', zip: '98225', _id: 563f5911e1be512a074e7181 },
					{ country: 'US', zip: '98227', _id: 563f5911e1be512a074e7182 } ],
				insertedCount: 2,
				insertedIds: [ 563f5911e1be512a074e7181, 563f5911e1be512a074e7182 ] }
			*/
			
			assert.equal(results.result.ok,1);
			
			SUT.dropCollection(config.datastore.config.mongodb, config.datastore.config.mongodb.collection, function(err, result){
				if (err) throw new Error("drop collection didn't work");
				if (result ==false ) throw new Error("drop collection didn't work");
				
			});
			done();
			
		});
	});
	it("Drop Collection", function (done) {		
		
		// give internet connection more time to get to mongo site
		this.timeout(20000);
		
		var jsonArray = [{"country": "US", "zip" : "98225"},{"country": "US", "zip" : "98227"}]; 
		
		SUT.insert(config.datastore.config.mongodb, jsonArray,function(err,results){

			
			SUT.dropCollection(config.datastore.config.mongodb, config.datastore.config.mongodb.collection, function(err, result){
				if (err) throw new Error("drop collection didn't work");
				if (result ==false ) throw new Error("drop collection didn't work");
				
			});
			done();
			
		});
	});	
});	
