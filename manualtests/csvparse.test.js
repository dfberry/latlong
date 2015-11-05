var fs = require('fs');
var parse = require('csv').parse;
var path = require('path'); 
var dataFile = path.join(__dirname,'/../data/test/tsv/US.txt');

	var parseOptions = {
		delimiter: "\t",
		quote: false,
		columns : [
				"countrycode",     
				"postalcode",       
				"placename",        
				"adminname1",       
				"admincode1",      
				"adminname2" ,      
				"admincode2",       
				"adminname3" ,      
				"admincode3" ,      
				"latitude" ,         
				"longitude" ,        
				"accuracy"  			
			]
	};
			//console.log(parseOptions);
var parser = parse(parseOptions, function(err, data){
  console.log(data);
  //console.log("inside parser");
});
//console.log(parser);
//console.log(dataFile);
fs.createReadStream(dataFile).pipe(parser);