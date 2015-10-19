// 3rd party libraries
var path = require("path");
var fs = require("fs");
var assert = require("chai").assert;

// custom directires
var fileMgmt = require("../src/file/file-mgmt.js");

// globals
var file = "../data/test/deleteFolderRecursive";
var final = path.join(__dirname, file);

describe("Folder Mgmt Test", function(){

	it("Delete folder -r  sync", function () {

		fileMgmt.deleteFolderRecursiveSync(final);

		fs.exists(final, function(exist){
			assert.equal(exist,false);
		});
	});
});	


