var customError = require("./error");
var fs = require("fs");

var exports = module.exports = {};

/*
Given path, recursively delete everything 
inside it
*/
function deleteFolderRecursiveSync(path) {

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
/*
doesFileExist
file: path and file name to verify
callback(err,bool)
*/
function doesFileExist(file, callback){
	
	fs.stat(file, function(err, stat) {
		if(err) {
			if(err.code == 'ENOENT') {
				callback(null, false)
			} else {
				callback(null, err.code);
			}
		} else { 
			callback(null,true);
		}
	});
}

/*
copyFile
piped
*/
function copyFile (from, to){
	fs.createReadStream(from).pipe(fs.createWriteStream(to));
}
/*
deleteFile
sync
*/
function deleteFileSync (file){
	fs.unlinkSync(file);
}

exports.deleteFolderRecursiveSync = deleteFolderRecursiveSync;
exports.copyFile = copyFile;
exports.deleteFileSync = deleteFileSync;
exports.doesFileExist = doesFileExist;