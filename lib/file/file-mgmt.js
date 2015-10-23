//http://www.geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
/* jshint node: true */
/* exported index */

// 3rd party libraries
var fs = require("fs");

var deleteFolderRecursiveSync = function(path) {

	if( fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file){
			var curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursiveSync(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path); // delete folder
	}
};

module.exports = {
	deleteFolderRecursiveSync: deleteFolderRecursiveSync
};