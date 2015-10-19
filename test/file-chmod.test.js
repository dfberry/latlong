// 3rd party libraries
var assert = require("chai").assert;
var fs = require("fs");
var path = require("path");
var Mode = require('stat-mode');

// custom libraries
var chmodConverter = require("../src/file/file-chmod.js")

// globals
var file = '../data/test/chmod/US.txt';

describe("File CHMOD Test", function(){

	beforeEach(function(done) {
		
		var fileWithPath = path.join(__dirname, file);
		fs.chmod(fileWithPath, '0000', function(err){
			if(err) throw err;
			fs.stat(fileWithPath, function (err, stat) {

				if (err) throw err;
				
				var mode = new Mode(stat);
				assert.equal(mode.toString(),"----------");
				
			});				
		});
		
		done();
	});

	it("change to all readable via callback", function (done) {

		// act	
		chmodConverter.makeReadable(file, function (err, returned) {

			// assert
			var Mode = require('stat-mode');
			var fileWithPath = path.join(__dirname, file);
			
			fs.stat(fileWithPath, function (err, stat) {

				if (err) throw err;
				
				var mode = new Mode(stat);
				assert.equal(mode.toString(),"-r--r--r--");
				
			});
		});
		done();
		
	});
	
	it("change to all readable  via promise", function (done) {

		chmodConverter.makeReadable(file)
		.then(function (returned) {
			var Mode = require('stat-mode');
			var fileWithPath = path.join(__dirname, file);
			
			fs.stat(fileWithPath, function (err, stat) {

				if (err) throw err;
				
				var mode = new Mode(stat);
				assert.equal(mode.toString(),"-r--r--r--");
				
			});			
			done();
		})
		.fail(function(error){
			done();
		});
	});	
});	