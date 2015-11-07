var MongoClient = require('mongodb').MongoClient;
 
// Use connect method to connect to the Server 
// connectionObject.url example 'mongodb://url:port/db'
// connectionOjbect.collection example 'geoZip'
// connectionObject.user example 'bob'
// connectionObject.pwd example '1234'
// searchObject example {FIELD5:'WA'}
var find = function (connectionObject, searchObject, callback){

	console.log("db-mongo::find");
	//console.log(connectionObject);
	//console.log(searchObject);

	MongoClient.connect(connectionObject.url, function(err, db) {
		
		console.log("db");
		//console.log(db);
		
		db.authenticate(connectionObject.user,connectionObject.pwd, function(err, authResult){
			
			console.log("authResult");
			//console.log(authResult);

			db.collection(connectionObject.collection, function(err,collectionResult){

				console.log("collectionResult");				
				//console.log(collectionResult);

				if (collectionResult != undefined){
					
								
					collectionResult.find(searchObject, function(err,cursor){
						
						console.log("cursor");
						//console.log(cursor);
						
					
						cursor.toArray(function(err,docs){
							
							console.log("docs");
							//console.log(docs);
							
							db.close();	
							callback(docs);
	
						});
					});	
				}
				else{
					
					console.log("collectionResult is empty");
					callback(null);
				}	
			});
			
		});
	});
}

// Use connect method to connect to the Server 
// connectionObject.url example 'mongodb://url:port/db'
// connectionOjbect.collection example 'geoZip'
// connectionObject.user example 'bob'
// connectionObject.pwd example '1234'
// insertObject example {FIELD5:'WA'}
var insert = function (connectionObject, insertObject, callback){

	console.log("db-mongo::find");
	//console.log(connectionObject);
	//console.log(searchObject);

	MongoClient.connect(connectionObject.url, function(err, db) {
		
		console.log("db");
		//console.log(db);
		
		db.authenticate(connectionObject.user,connectionObject.pwd, function(err, authResult){
			
			console.log("authResult");
			//console.log(authResult);

			db.collection(connectionObject.collection, function(err,collectionResult){

				console.log("collectionResult");				
				//console.log(collectionResult);

				if (collectionResult != undefined){
					
								
					collectionResult.insert(insertObject, function(err,cursor){
						
						console.log("insert complete");
							
						db.close();	
						callback(null);
	
					});	
				}
				else{
					
					console.log("collectionResult is empty");
					callback(null);
				}	
			});
			
		});
	});
}

var search = function(connectionObject, searchTerm, searchValue, callback){
	
	console.log("db-mongo::search - searchTerm " + searchTerm);
    console.log("db-mongo::search - searchValue " + searchValue);
	
	// get ojbect which has column names
	var searchObject = {};
	searchObject[searchTerm] = searchValue;
	//var jsonSearchObject = searchObject;

	console.log(searchObject);
    //console.log(jsonSearchObject);

	
	find(connectionObject,searchObject, function(jsonResult){
		callback(jsonResult);
		//callback();
	});
	
}

var fields = function(connectionObject, callback){
	
	console.log("db-mongo::fields");
	
	// get ojbect which has column names
	var searchObject = {"FIELD1": "countrycode"};
	
	find(connectionObject,searchObject, function(jsonResult){
		
		if (jsonResult.length==1){
			var p=jsonResult[0];
			delete p['_id'];
			callback(p);
			console.log("db-mongo::fields - done");
		} else {
			console.log("db-mongo::fields - done");
			callback(jsonResult);
 		}
	});
}

// public functions
module.exports = {
	find: find,
	fields: fields,
	search: search,
	insert: insert
}

