/* jshint node: true */

// 3rd party libraries
var assert = require("chai").assert;
var expect = require("chai").expect;
var fs = require("fs");

// custom libraries
var SUT = require("../lib/io-utils.js");

describe("Parse", function(){

	it("Convert tab-delimited to json", function (done) {		
		this.timeout(30000);

		// arrange
		var dataTSV = fs.readFileSync('data/Keep/US/US.txt',"utf-8");
		var columnNames = [
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
			];

		// act
		SUT.parseTsvToJson(dataTSV,columnNames, function(error, results){
			

			if (error){
				assert.fail();
			} else {
				// assert
				assert(Array.isArray(results),'result is array');
				assert.equal(43633, results.length);
			}
			done();

		});
		
	});
});	
