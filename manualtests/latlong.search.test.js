/* jshint node: true */
'use strict';

var latlong = require("../latlong.js");

var configFile = require('../data/test/config/config1.json');
var searchTerm = "FIELD5";
var searchValue = "WA";

console.log(latlong);

latlong.Search.Fields(configFile)
		.then(function (results) {
			console.log(results);
		})
		.fail(function(error){
			console.log(error);
		});

latlong.Search.ByTerm(configFile, searchTerm, searchValue)
		.then(function (results) {
			console.log(results);
		})
		.fail(function(error){
			console.log(error);
		});
		