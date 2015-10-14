// 3rd party libraries
var unzip2 = require("unzip2");
var fs = require("fs");
var path = require("path");

var DecompressLibrary = require('decompress');

var decompressAsync = function (zipfile, unzipLocation, callback){

	var archive = path.join(__dirname, zipfile);
	var final = path.join(__dirname, unzipLocation);
	
	console.log(archive);
	console.log(final);
	
	/*
	var tempDecompress = new DecompressLibrary({mode: '755'})
		.src(archive)
		.dest(final)
		.use(DecompressLibrary.zip({strip: 1}))
		.run(function(err,files){
			console.log(files.length);
		});
	*/
	
	var decompress = new DecompressLibrary()
		.src(archive)
		.dest(final)
		.use(DecompressLibrary.zip());

	decompress.run(function (err, files) {
		console.log(err);
		
		callback(err, files);
	});
	
	
} 
 


// unzipTab 
// zipfile - path and file to zip file
// unzipLocation - path to unzip diretory
var unzip = function(zipfile, unzipLocation){
	
	var archive = path.join(__dirname, zipfile);
	var final = path.join(__dirname, unzipLocation);
	
	fs.exists(archive, function(exists){
		if (exists===true){
			console.log("unzip.unzip::zip file found");	
			fs.createReadStream(archive).pipe(unzip2.Extract({ path: final }));
		}
		else{
			console.log("unzip.unzip::zip file not found");	
		}
	});
}


module.exports = {
	unzip : unzip,
	decompress: decompressAsync
}

