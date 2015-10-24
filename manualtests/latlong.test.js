var latlong = require("../latlong.js");
var myfile = '../data/test/config/config1.json';
var path = require("path");

var myfileWithPath = path.join(__dirname, myfile);

console.log("before call");
console.log(latlong);

latlong.Init.Load(myfileWithPath)
		.then(function (results) {
			console.log(results);
		})
		.fail(function(error){
			console.log(error);
		});