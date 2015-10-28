var latlong = require("../latlong.waterfall.js");

latlong.Init.Load('../data/test/config/configLoadSuccess.success.json', function(err, results){
	if (err){
		console.log("error");	
		console.log(err);
	} 
	console.log(results);
});
