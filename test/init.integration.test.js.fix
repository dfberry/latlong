/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var path = require("path");

// custom libraries
var sut = require("../latlong.waterfall.js").Init;



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
};
var secureConfig = require("../data/test/config/config.secure.json");

/* 
need to add url, user, and pwd to mongodb json object
*/
config.datastore.config.mongodb.url = secureConfig.mongodb.url;
config.datastore.config.mongodb.user = secureConfig.mongodb.user;
config.datastore.config.mongodb.pwd = secureConfig.mongodb.pwd;


describe("Latlong", function(){

	it("init", function (done) {
		this.timeout(5000);
		
		sut.Load(config, function (err, results) {
			if (err) console.log(err);
			if (results) console.log(results);
			assert.equal(err,null);
			//assert.equal(results.length,null);
			done();
		});
		
		
	});
});	
