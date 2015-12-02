var MongoClient = require('mongodb').MongoClient;
 
// Use connect method to connect to the Server 
// connectionObject.url example 'mongodb://url:port/db'
// connectionOjbect.collection example 'geoZip'
// connectionObject.user example 'bob'
// connectionObject.pwd example '1234'
// searchObject example {FIELD5:'WA'}
var find = function (connectionObject, searchObject, callback){

	MongoClient.connect(connectionObject.url, function(err, db) {
		
		db.authenticate(connectionObject.user,connectionObject.pwd, function(err, authResult){

			db.collection(connectionObject.collection, function(err,collectionResult){

				if (collectionResult != undefined){		
								
					collectionResult.find(searchObject, function(err,cursor){

						cursor.toArray(function(err,docs){
							
							db.close();	
							callback(docs);
						});
					});	
				}
				else{
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

	MongoClient.connect(connectionObject.url, function(err, db) {
				
		if (err) {callback("connect failed");}
		else {
				
			db.authenticate(connectionObject.user,connectionObject.pwd, function(err, authResult){
				
				if (err) {callback("auth failed");}
				else {
				
					db.collection(connectionObject.collection, function(err,collectionResult){
						
						if (err) {callback("collectionResult is empty");}
						else {
										
							collectionResult.insert(insertObject, function(error, result){
								db.close();	
								if (err) callback(err);
								callback(null,result);
							});	
						}
					});
				}
			});
		}
	});
}

// Use connect method to connect to the Server 
// connectionObject.url example 'mongodb://url:port/db'
// connectionOjbect.collection example 'geoZip'
// connectionObject.user example 'bob'
// connectionObject.pwd example '1234'
// insertObject example {FIELD5:'WA'}
var dropCollection = function (connectionObject, collectionObjectName, callback){

	MongoClient.connect(connectionObject.url, function(err, db) {
				
		if (err) {callback("connect failed");}
		else{
				
			db.authenticate(connectionObject.user,connectionObject.pwd, function(err, authResult){
				
				if (err) {callback("auth failed");}
				else {
				
					db.collection(connectionObject.collection, function(err,collection){
						
						if (err) {callback("collectionResult is empty");}
						else {
							collection.drop(collectionObjectName, function(error, result){
								db.close();	
								if (err) {callback(err);}
								else {
									callback(null,result);
								}
							});	
						}
					});
				}
			});
		}
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
	insert: insert,
	dropCollection: dropCollection
}

