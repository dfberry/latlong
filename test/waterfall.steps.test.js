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
	"country" : ["abc.zip", "US.zip", "CA.zip", "AG.zip", "RU.zip"],
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


describe("Waterfall Steps", function(){

	it("Download", function (done) {
		this.timeout(20000);
				
		var country = "US";
		var destinationFile = config.datadirectory + country + ".zip";		
				
		// adds '.zip' to country inside step1Download
		SUT.step1Download(config, "US", function (err, status) {
			
			if (err){ expect(err).to.be.null; }
			else {
				expect(status).to.exist;
				expect(err).to.be.null;
				
				var deleteFilePath = path.join(__dirname,destinationFile);
				
				myIOUtils.doesFileExist(deleteFilePath, function(err, boolStatus){
					expect(boolStatus).to.equal(true);
					if(boolStatus==true){
						console.log("file exists = " + deleteFilePath);
						myIOUtils.deleteFileSync(deleteFilePath);
					}
				});
			}
				
			done();
		});
		
	});
});	