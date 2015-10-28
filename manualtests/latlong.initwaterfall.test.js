var latlong = require("../latlong.waterfall.js");

latlong.Init.Load('../data/test/config/configLoadSuccess.success.json', function(err, results){
	if(err){
		console.log("err latlong.Init.Load:" + err);
	} else {
		console.log("ok latlong.Init.Load:" + results);
	}
});
