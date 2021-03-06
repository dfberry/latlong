/* jshint node: true */
'use strict';

// 3rd party libraries
var assert = require("chai").assert;
//var path = require("path");

// custom libraries
var latlong = require("../latlong.waterfall.js");

// globals
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
	}

var secureConfig = require("../data/test/config/config.secure.json");

/* 
need to add url, user, and pwd to mongodb json object
*/
config.datastore.config.mongodb.url = secureConfig.mongodb.url;
config.datastore.config.mongodb.user = secureConfig.mongodb.user;
config.datastore.config.mongodb.pwd = secureConfig.mongodb.pwd;

/*

DFB: adding more time as the mongo db seems to be a bit slow

*/
describe("Latlong Search", function(){

	it(".ByTerm", function (done) {
		this.timeout(20000);
		
		var searchTerm	= 'FIELD5';
		var searchValue = 'WA';
		
		latlong.Search.ByTerm(config.datastore.config.mongodb, searchTerm, searchValue, function (err, results) {
			assert.equal(err,null);
			assert.equal(results.length,747);
			done();
		});
	});

	
	it(".Fields ", function (done) {
		this.timeout(20000);
		latlong.Search.Fields(config.datastore.config.mongodb, function (err, results) {
			assert.equal(err,null);
			assert.equal(results.length,1);
			done();
		});
	});

});	