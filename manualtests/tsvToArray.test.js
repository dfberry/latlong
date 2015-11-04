
require('node-require-tsv');
var fs = require("fs");
var path = require("path");
var tsvFile = '../data/test/tsv/US.tsv';

var arrayOfTsvStrings = require(tsvFile); 
	
console.log(JSON.stringify(arrayOfTsvStrings));