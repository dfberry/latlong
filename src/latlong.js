var unzip = require('./file/file-unzip.js')

//unzip.unzip('../../data/US.zip', '../../data/US');

unzip.decompress('../../data/US.zip', '../../data/US',function(err, files){
			console.log(err);
			console.log(files ? files.length : "no files");
		});