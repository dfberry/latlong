// 3rd party libraries
var unzip = require("unzip2");
var fs = require("fs");
var path = require("path");

// latlong library
var unzipTab = function(zipfile, unzipLocation){
	console.log("unzipTab called");
	
	var archive = path.join(__dirname, zipfile);
	var final = path.join(__dirname, unzipLocation);
	
	fs.exists(archive, function(exists){
		
		console.log("exists:" + exists);
		
		if (exists===true){
		
			console.log("zipped file exists");
	
			var unzipExtractor = unzip.Extract({ path: final });
			unzipExtractor.on('error', function (err) {
				throw err;
			});
			unzipExtractor.on('close', function(){
				console.log("close");
			});

			fs.createReadStream(archive).pipe(unzipExtractor);
	
			
			fs.exists(unzipLocation, function(){
				console.log("unzipped file exists");
			});
		}
		
	});
	
}


module.exports = {
	unzipTab : unzipTab
}

