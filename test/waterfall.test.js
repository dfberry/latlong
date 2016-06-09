/* jshint node: true */
'use strict';

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var path = require("path");

// custom libraries
var myIOUtils = require("../lib/io-utils.js");
var SUT = require("../lib/initwaterfall.js");

var config = {
	"dataurl": "http://download.geonames.org/export/zip/",
	"country" : ["US.zip"],
	"datadirectory": "../data/test/integration/",
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


describe("Waterfall", function(){

	it("all steps together for 1 country", function (done) {
		this.timeout(20000);
								
		// adds '.zip' to country inside step1Download
		SUT.waterfall(config, "US", function (err, status) {
			
			expect(err).to.be.null; 
			console.log("test callback: " + status);
			done();	
			
		});
		
	});
});	