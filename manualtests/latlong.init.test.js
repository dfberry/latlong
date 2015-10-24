var latlong = require("../latlong.js");

latlong.Init.Load('../data/test/config/configLoadSuccess.success.json')
			.then(function (results) {
				console.log(results);
			})
			.fail(function(error){	
				console.log(error); 
			});