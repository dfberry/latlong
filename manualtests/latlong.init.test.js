var latlong = require("../latlong.js");

latlong.Init.Load('../data/test/config/configLoadSuccess.success.json')
			.then(function (results) {
				console.log("done:" + JSON.stringify(results));
			})
			.fail(function(error){	
				console.log("error");
				console.log(error);
			});