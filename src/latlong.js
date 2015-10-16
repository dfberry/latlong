var unzip = require('./file/file-unzip.js')

var zippedFile = 'US.zip';
var unzippedDirectory = 'US';

// using promise instead of callback
unzip.unzip(zippedFile, unzippedDirectory + '1')
		.then(function (files) {
			console.log(files[0]);
		})
		.fail(function(error){
			console.log(error);
		});